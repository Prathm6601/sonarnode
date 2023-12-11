import type { Service, ServiceSchema } from "moleculer";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { Employee } from "../../types/employee";
import { sendEmail } from "../../helpers/mailhelper";
import * as bcrypt from "bcrypt";
import querystring from "querystring";
import axios from "axios";
import { Errors } from "moleculer";
import { v4 as uuid } from "uuid";
require("dotenv").config();

const prisma = new PrismaClient();
const { MoleculerClientError } = Errors;

const GOOGLE_CLIENT_ID =
	process.env.GOOGLE_CLIENT_ID ||
	"210475497625-ogtaida80g4g4hugdaer7q3v6hcfua4m.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET =
	process.env.GOOGLE_CLIENT_SECRET || "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";
const SERVER_ROOT_URI = String(process.env.SERVER_ROOT_URI);
const UI_ROOT_URI = String(process.env.UI_ROOT_URI);
const JWT_SECRET = "shhhhh";
const redirectURI = "api/authmodule/auth/google";

export interface ActionHelloParams {
	name: string;
}

interface AuthSettings {
	JWT_SECRET: string;
}

interface AuthMethods {
	uppercase(str: string): string;
}

interface AuthLocalVars {
	myVar: string;
}

type AuthThis = Service<AuthSettings> & AuthMethods & AuthLocalVars;

const AuthService: ServiceSchema<AuthSettings> = {
	name: "authmodule",

	/**
	 * Settings
	 */
	settings: {
		JWT_SECRET: String(process.env.JWT_SECRET),
	},
	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		login: {
			rest: {
				method: "POST",
				path: "/login",
			},
			async handler(ctx) {
				try {
					if (ctx.params.email_address) {
						const employee = await prisma.nucleus_employee_main.findFirst({
							where: { email_address: ctx.params.email_address },
							include: {
								role: {
									include: {
										nucleus_role_level: true,
									},
								},
							},
						});
						if (!employee)
							throw new MoleculerClientError(
								"Invalid Credentials, Please check Email and Password",
								401,
								"INVALID_CREDENTIALS",
							);
						const verifiedPassword = await bcrypt.compare(
							ctx.params.password,
							employee.password ?? "",
						);
						if (!verifiedPassword)
							throw new MoleculerClientError(
								"Invalid Credentials, Please check Email and Password",
								401,
								"INVALID_CREDENTIALS",
							);
						if (employee && verifiedPassword) {
							const json = {
								status: "success",
								message: "Employee logged in successfully",
								access_token: await this.generateJWT(employee, "access"),
								refresh_token: await this.generateJWT(employee, "refresh"),
								role: employee?.role,
							};
							return json;
						}
					}
					if (ctx.params.contact_number) {
						const employee = await prisma.nucleus_employee_main.findFirst({
							where: { contact_number: ctx.params.contact_number },
						});
						if (!employee?.id)
							throw new MoleculerClientError(
								"Please enter valid phone number",
								401,
								"INVALID_PHONE_NUMBER",
							);
						const otp: number = await this.generateOTP(4);
						const expiredAt = new Date();
						expiredAt.setSeconds(expiredAt.getSeconds() + 600);
						const updated = await prisma.temp_employee.create({
							data: {
								employee_id: employee.id,
								otp: Number(otp),
								email_address: employee.email_address ?? "",
								contact_number: employee.contact_number ?? "",
								expired_at: expiredAt.getTime(),
								created_date: new Date(),
							},
						});
						if (updated) {
							// const accountSid =
							// 	process.env.TWILIO_ACCOUNT_SID ??
							// 	"AC3c0811fec0434b977f16e3be0c001fa3";
							// const authToken =
							// 	process.env.TWILIO_AUTH_TOKEN ?? "5efcbc7786812668bcbf70f74d424d77";
							// const client = require("twilio")(accountSid, authToken);
							// let message = "";

							// client.messages
							// 	.create({
							// 		body: `Please use otp ${otp} for login`,
							// 		from: "+12052363616",
							// 		to: `+91${ctx.params.contact_number}`,
							// 	})
							// 	.then((message: { sid: any }) => {
							// 		message = message.sid;
							// 	})
							// 	.catch((err: any) =>
							// 		this.logger.info("occured while posting otp", err),
							// 	);
							const forgotpassword = "verifyOtp";
							const receipents = {
								to: [employee.email_address ?? ""],
								subject: "OTP for your Nira sign-in",
								host: `${ctx.params.host}`,
								data: otp,
								name: employee.first_name,
							};

							const emailresult = await sendEmail(forgotpassword, receipents);
							if (emailresult.accepted?.length) {
								return {
									status: true,
									message: `OTP is sent to your registered email`,
								};
							} else {
								throw new MoleculerClientError(
									"Failed to sent OTP to email",
									400,
									"OTP_SENT_FAILED",
								);
							}
						}
					}
				} catch (err) {
					throw err;
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		verifyOtp: {
			rest: {
				method: "POST",
				path: "/verifyotp",
			},
			async handler(ctx) {
				try {
					if (!ctx.params.phone_otp || !ctx.params.contact_number)
						throw new Error(
							ctx.params.phone_otp
								? `Please enter contact number`
								: `Please enter otp`,
						);

					const employee = await prisma.nucleus_employee_main.findFirst({
						where: { contact_number: ctx.params.contact_number },
						include: {
							role: {
								include: {
									nucleus_role_level: true,
								},
							},
						},
					});

					const data = await prisma.temp_employee.findFirst({
						where: {
							AND: [
								{ otp: ctx.params.phone_otp },
								{ contact_number: ctx.params.contact_number },
								{ status: "pending" },
							],
						},
						orderBy: {
							id: "desc",
						},
					});
					if (!data)
						throw new MoleculerClientError(
							"Please enter valid OTP",
							401,
							"INVALID_OTP",
						);
					if ((data?.expired_at ?? 0) < new Date().getTime()) {
						throw new MoleculerClientError(
							"OTP expired. Please request a new one",
							401,
							"INVALID_OTP",
						);
					}
					const updatetempemployee = await prisma.temp_employee.update({
						where: {
							id: data.id,
						},
						data: {
							status: "verified",
						},
					});

					if (updatetempemployee.id) {
						this.logger.info(`Otp is verified`);
						const deleteEmployee = await prisma.temp_employee.delete({
							where: {
								id: updatetempemployee.id,
							},
						});
						if (deleteEmployee.id) this.logger.info("Temp employee is deleted");
					} else {
						throw new MoleculerClientError(
							"OTP not verified. Something went wrong",
							401,
							"OTP_NOT_VERIFIED",
						);
					}
					const json = {
						status: "success",
						message: "Employee logged in successfully",
						access_token: await this.generateJWT(data, "access"),
						refresh_token: await this.generateJWT(data, "refresh"),
						role: employee?.role,
					};
					return json;
				} catch (err) {
					throw err;
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		googleUrl: {
			rest: {
				method: "GET",
				path: "/auth/google/url",
			},
			async handler(ctx) {
				return this.getGoogleAuthURL();
			},
		},

		getuserfromGoogle: {
			rest: {
				method: "GET",
				path: "/auth/google",
			},
			params: {
				code: "string",
			},
			async handler(ctx) {
				try {
					const code = ctx.params.code as string;

					const { id_token, access_token, refresh_token } = await this.getTokens({
						code,
						clientId: GOOGLE_CLIENT_ID,
						clientSecret: GOOGLE_CLIENT_SECRET,
						redirectUri: `${SERVER_ROOT_URI}/${redirectURI}`,
					});

					// Fetch the user's profile with the access token and bearer
					const googleUser = await axios
						.get(
							`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
							{
								headers: {
									Authorization: `Bearer ${id_token}`,
								},
							},
						)
						.then((res) => res.data)
						.catch((error) => {
							console.error(`Failed to fetch employee`);
							throw new Error(error.message);
						});

					const token = jwt.sign(googleUser, JWT_SECRET);
					const decoded: any = jwt.verify(token, JWT_SECRET);
					const sid: string = uuid();
					const employee = await prisma.nucleus_employee_main.findFirst({
						where: { email_address: decoded.email },
					});

					const cookieName = "access_token";
					const cookieValue = await this.generateJWT(employee, "access");
					ctx.meta.$responseHeaders = {
						"Set-Cookie": `${cookieName}=${cookieValue}; Path=/; HttpOnly:true,maxAge: 3600000,secure: true`,
						"Custom-Header": "Custom Header Value",
					};
					if (!employee) {
						const employeeCreated = await prisma.nucleus_employee_main.create({
							data: {
								email_address: decoded.email,
								google_id: decoded.id,
								employee_code: "",
								shift_id: 1,
								role_id: 7,
							},
						});

						if (employeeCreated.id) {
							ctx.meta.$statusCode = 302;
							ctx.meta.$location = UI_ROOT_URI;
							// const json = {
							// 	status: "success",
							// 	message: "User logged in successfully",
							// 	access_token: access_token,
							// 	refresh_token: refresh_token,
							// };
							// return json;
						}
					} else {
						ctx.meta.$statusCode = 302;
						ctx.meta.$location = UI_ROOT_URI;
						// const json = {
						// 	status: "success",
						// 	message: "User logged in successfully",
						// 	access_token: access_token,
						// 	refresh_token: refresh_token,
						// };
						// return json;
					}
					//   ctx.redirect(UI_ROOT_URI);

					return;
				} catch (err) {
					this.logger.error(`Error occured while getting employee from google`);
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		refreshToken: {
			rest: {
				method: "GET",
				path: "/refreshtoken",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const decoded: any = jwt.verify(
						ctx.meta.user.authToken,
						String(process.env.JWT_SECRET),
					);
					const json = {
						status: "success",
						access_token: await this.generateJWT(decoded, "access"),
					};
					return json;
				} catch (err) {
					this.logger.error(`Error occured while creating refresh token`);
					throw new Error(err);
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		googlerefreshToken: {
			rest: {
				method: "POST",
				path: "googlerefreshtoken",
			},
			async handler(ctx) {
				const data = await axios
					.post("https://www.googleapis.com/oauth2/v4/token", {
						client_id: GOOGLE_CLIENT_ID,
						client_secret: GOOGLE_CLIENT_SECRET,
						refresh_token: ctx.params.refresh_token,
						grant_type: "refresh_token",
					})
					.then(
						(response) => {
							console.log(response);
							return response.data;
						},
						(error) => {
							console.log(error);
						},
					);
				return data;
			},
		},
		logout: {
			rest: {
				method: "GET",
				path: "/logout",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const data = await prisma.blacklist.create({
						data: {
							token: ctx.meta.user.authToken,
							created_date: new Date(),
							modified_date: new Date(),
						},
					});
					if (data.id) {
						return { success: true, message: "You have been Logged out Successfully" };
					}
				} catch (err) {
					this.logger.error("Error occured while logging out", err);
					return err;
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		getEmployee: {
			rest: {
				method: "GET",
				path: "/employee",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const employeeData = await prisma.nucleus_employee_main.findFirst({
						where: { id: ctx.meta.user.id },
						select: {
							id: true,
							employee_code: true,
							first_name: true,
							last_name: true,
							email_address: true,
							profile_image: true,
							designation: {
								select: {
									id: true,
									name: true,
								},
							},
							role: {
								include: {
									nucleus_role_level: true,
								},
							},
						},
					});

					if (employeeData?.id) {
						return { status: true, data: employeeData };
					} else {
						throw new MoleculerClientError(
							"Error occured whiel getting user data",
							401,
							"USER_REQUEST_ERROR",
						);
					}
				} catch (err) {
					this.logger.error(`Error occured while getting errror`, err);
					throw new Error(err.message);
				} finally {
					await prisma.$disconnect();
				}
			},
		},
	},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {
		async generateJWT(employee: Employee, token?: string) {
			const today = new Date();
			const exp = new Date(today);
			token == "access"
				? exp.setDate(today.getDate() + 1)
				: exp.setDate(today.getDate() + 30);

			return jwt.sign(
				{
					id: employee.id,
					service: "api",
					exp: Math.floor(exp.getTime() / 1000),
				},
				this.settings.JWT_SECRET,
			);
		},

		async generateOTP(otp_length: number) {
			let digits = "0123456789";
			let OTP = "";
			for (let i = 0; i < otp_length; i++) {
				OTP += digits[Math.floor(Math.random() * 10)];
			}
			return OTP;
		},

		async getGoogleAuthURL() {
			const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
			const options = {
				redirect_uri: `${SERVER_ROOT_URI}/${redirectURI}`,
				client_id: GOOGLE_CLIENT_ID,
				access_type: "offline",
				response_type: "code",
				prompt: "consent",
				scope: [
					"https://www.googleapis.com/auth/userinfo.profile",
					"https://www.googleapis.com/auth/userinfo.email",
				].join(" "),
			};

			return `${rootUrl}?${querystring.stringify(options)}`;
		},

		async getTokens({
			code,
			clientId,
			clientSecret,
			redirectUri,
		}: {
			code: string;
			clientId: string;
			clientSecret: string;
			redirectUri: string;
		}): Promise<{
			access_token: string;
			expires_in: Number;
			refresh_token: string;
			scope: string;
			id_token: string;
		}> {
			/*
			 * Uses the code to get tokens
			 * that can be used to fetch the user's profile
			 */
			const url = "https://oauth2.googleapis.com/token";
			const values = {
				code,
				client_id: clientId,
				client_secret: clientSecret,
				redirect_uri: redirectUri,
				grant_type: "authorization_code",
			};

			return axios
				.post(url, querystring.stringify(values), {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				})
				.then((res: any) => res.data)
				.catch((error: any) => {
					console.error(`Failed to fetch auth tokens`);
					throw new Error(error.message);
				});
		},

		async setCookie(ctx, value) {
			// Define your cookie parameters (name, value, options)
			const cookieName = "myCookie";
			const cookieValue = value;
			const cookieOptions = {
				// Set your cookie options, such as the expiration time and other attributes
				maxAge: 3600000, // Cookie expiration time in milliseconds (e.g., 1 hour)
				httpOnly: true, // Make the cookie accessible only through HTTP (not JavaScript)
				secure: true, // Set to true if you want the cookie to be sent over HTTPS
			};

			// Create the Set-Cookie header value
			const cookieHeader = `${cookieName}=${cookieValue}; ${Object.entries(cookieOptions)
				.map(([key, value]) => value)
				.join("; ")}`;

			// Set the cookie in the response header
			ctx.meta.$responseHeaders = {
				"Set-Cookie": cookieHeader,
			};

			// Return a response message or data (optional)
			return "Cookie set successfully";
		},
	},

	/**
	 * Service created lifecycle event handler
	 */
	created(this: Service<AuthSettings>) {},

	/**
	 * Service started lifecycle event handler
	 */
	async started(this: Service<AuthSettings>) {
		const connectionCount = await prisma.$executeRaw`SELECT count(*) FROM pg_stat_activity`;
		console.log("------------------------connection established---------",connectionCount);
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped(this: Service<AuthSettings>) {},
};

export default AuthService;
