import type { Context, GenericObject, Service, ServiceSchema } from "moleculer";
import { PrismaClient } from "@prisma/client";
import XLSX from "xlsx";
import { Errors } from "moleculer";
import { HolidayEntry } from "../../types/holiday";
import { UserValidationUtil } from "../../validation/user.validation";
import { sendEmail } from "../../helpers/mailhelper";
import { OnBoardUser } from "../../types/user";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import * as fs from "fs";
require("dotenv").config();

const { MoleculerClientError } = Errors;
const path = String(process.env.UPLOAD_PATH);

interface MiscellaneousSettings {
	JWT_SECRET: string;
}

interface MiscellaneousMethods {
	uppercase(str: string): string;
}

interface MiscellaneousMethods {
	uppercase(str: string): string;
}
interface MiscellaneousLocalVars {
	myVar: string;
}

type miscellaneousThis = Service<MiscellaneousSettings> &
	MiscellaneousMethods &
	MiscellaneousLocalVars;
// Create an instance of the Prisma client
const prisma = new PrismaClient();

const MiscellaneousService: ServiceSchema<MiscellaneousSettings> = {
	name: "miscellaneous",

	settings: {
		JWT_SECRET: String(process.env.JWT_SECRET),
	},

	actions: {
		// UPLOAD Holiday
		createHolidays: {
			rest: {
				method: "POST",
				path: "/createholidays",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const workbook = XLSX.readFile(`${path}/${ctx.params.filename}`);
					const sheetName = workbook.SheetNames[0];
					const sheet = workbook.Sheets[sheetName];
					const holidayList: HolidayEntry[] = XLSX.utils.sheet_to_json(sheet, {
						raw: false,
						dateNF: "yyyy-mm-dd",
					});

					const createdHolidays = [];

					for (const entry of holidayList) {
						const { name, holiday, from, to } = entry;
						try {
							const response = await prisma.nucleus_holiday_main.create({
								data: {
									name,
									holiday: new Date(),
									from,
									to,
									created_by: 11,
									modified_by: 11,
								},
							});
							createdHolidays.push(response);
						} catch (error) {
							console.error("Error creating holiday:", error.message);
							throw new Error("Failed to create holidaysList");
						}
					}

					return {
						status: true,
						data: createdHolidays,
						message: "Holidays created successfully",
					};
				} catch (error) {
					console.error("Error processing holidays:", error.message);
					throw new Error("Failed to process holidays");
				} finally {
					await prisma.$disconnect();
					fs.unlink(`${path}/${ctx.params.filename}`, (err) => {
						if (err) {
							this.logger.info(`An error occurred ${err.message}`);
						} else {
							this.logger.info(`Deleted the file under ${path}`);
						}
					});
				}
			},
		},

		onBoardUsers: {
			rest: {
				method: "POST",
				path: "/onboarduser",
			},
			params: {
				//user_code: { type: "string", custom: UserValidationUtil.validateUserCode },
				first_name: { type: "string", custom: UserValidationUtil.validateFirstName },
				last_name: { type: "string", custom: UserValidationUtil.validateLastName },
				email_address: { type: "string", custom: UserValidationUtil.validateEmail },
				contact_number: { type: "string", custom: UserValidationUtil.validatePhoneNumber },
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const [existEmail, existEmailEmployee] = await prisma.$transaction([
						prisma.nucleus_user_main.findFirst({
							where: { primary_email_address: ctx.params.email_address },
						}),
						prisma.nucleus_employee_main.findFirst({
							where: { email_address: ctx.params.email_address },
						}),
					]);
					if (existEmail || existEmailEmployee)
						throw new MoleculerClientError(
							`Email Already exist`,
							401,
							"EMAIL_EXIST_ERROR",
						);
					const totalUser = await this.userCount();
					const newUserId = totalUser.length ? totalUser[0].id + 1 : 1;
					const data = await prisma.nucleus_user_main.create({
						data: {
							user_code: newUserId.toString(),
							first_name: ctx.params.first_name,
							last_name: ctx.params.last_name,
							primary_email_address: ctx.params.email_address,
							primary_contact_number: ctx.params.contact_number,
							date_of_joining: new Date(),
							is_onboarding: ctx.params.is_onboarding,
							invite_user: "Invite Sent",
							role: "Dept.User",
							created_by: ctx.meta.user.id,
							modified_by: ctx.meta.user.id,
							created_date: new Date(),
							modified_date: new Date(),
						},
					});
					if (data.id) {
						const sid: string = uuid();
						const token = await this.generateJWT(sid);
						const addedToken = await prisma.session.create({
							data: {
								sid: sid,
								token: token,
							},
						});
						if (addedToken.sid) this.logger.info(`Token added to session table`);
						else this.logger.info(`Error occured while adding session`);
						const response = await this.sentInvitation(
							[ctx.params.email_address],
							ctx.params.first_name,
							token,
						);
						if (response) {
							this.logger.info(`Email Invitation sent Successfully`);
						} else this.logger.info(`Error occured while sending email invitation`);
						return { status: true, message: `Data Submitted Successfully` };
					} else {
						throw new MoleculerClientError(
							"Error occured while onboarding user",
							401,
							"ON_BOARD_USER_ERROR",
						);
					}
				} catch (error) {
					this.logger.error("Error occured while onbaording user :", error.message);
					throw error.message;
				} finally {
					fs.unlink(`${path}/${ctx.params.filename}`, (err) => {
						if (err) {
							this.logger.info(`An error occurred ${err.message}`);
						} else {
							this.logger.info(`Deleted the file under ${path}`);
						}
					});
					await prisma.$disconnect();
				}
			},
		},

		getOnBoardUser: {
			rest: {
				method: "GET",
				path: "/onboarduser",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					let query = {};

					if (ctx.params.limit || ctx.params.offset)
						query = {
							skip: Number(ctx.params.offset) ?? 0,
							take: Number(ctx.params.limit) ?? 10,
						};
					const [users, count] = await prisma.$transaction([
						prisma.nucleus_user_main.findMany(query),
						prisma.nucleus_user_main.count(),
					]);

					return {
						status: true,
						pagination: {
							total: count,
						},
						data: users,
					};
				} catch (err) {
					this.logger.error(`Error occured while fetching onboarded data`);
					throw err.message;
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		resendInvitation: {
			rest: {
				method: "POST",
				path: "/resendinvitation",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const sid: string = uuid();
					const data = await prisma.nucleus_user_main.findFirst({
						where: { primary_email_address: ctx.params.email_address },
					});
					const token = await this.generateJWT(sid);
					const addedToken = await prisma.session.create({
						data: {
							sid: sid,
							token: token,
						},
					});
					if (addedToken.sid) this.logger.info(`Token added to session table`);
					else this.logger.info(`Error occured while adding session`);
					const response = await this.sentInvitation(
						[ctx.params.email_address],
						data?.first_name,
						token,
					);
					if (response) {
						this.logger.info(`Email Invitation sent Successfully`);
						return { status: true, message: "Email Invitation sent Successfully" };
					} else this.logger.info(`Error occured while sending email invitation`);
				} catch (err) {
					this.logger.error(`Error occured while resending invitation`);
					throw err.message;
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		getLastInserteduser: {
			rest: {
				method: "GET",
				path: "/lastinserted",
			},
			restricted: ["api"],
			async handler() {
				try {
					const data = await prisma.nucleus_user_main.findMany({
						orderBy: { id: "desc" },
					});
					const licensedUser = await prisma.nucleus_organization_main.findMany({
						select: {
							user_license: true,
							nucleus_sitepreference_main: {
								select: {
									emp_code: true,
								},
							},
						},
					});
					const remainingLicensedUser = Number(licensedUser[0]?.user_license ?? 20);
					if (data.length) {
						return {
							status: true,
							data: {
								user_code: data[0].user_code,
								total_user: data.length,
								remainingLicensedUser: remainingLicensedUser,
							},
						};
					}
				} catch (err) {
					this.logger.error(`Error occured while getting last inserted user`);
					throw err.message;
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		userBulkUpload: {
			rest: {
				method: "POST",
				path: "/user/upload",
			},
			restricted: ["api"],
			async handler(ctx) {
				const fileType:string[] = ["csv","xlsx"]
				if (!ctx.params.filename)
					throw new MoleculerClientError(
						"Please upload file in xsls format or csv format less than 10 MB",
						401,
						"MISSING_FILE",
					);
				const checkFileType = ctx.params.filename.split(".");
				if (!fileType.includes(checkFileType[checkFileType.length - 1]) || (ctx.params.filesize > 10 * 1024 * 1024)){
					throw new MoleculerClientError(
						"Please upload xlsx or csv format file and less than 10 MB",
						401,
						"INVALID_FORMAT_ERROR",
					);}
				const uniqueUserData: Partial<OnBoardUser>[] = [];
				const duplicateUserData: Partial<OnBoardUser>[] = [];
				const failedUserData: Partial<OnBoardUser>[] = [];
				const email = [];
				const firstName = [];
				let insertedData;
				const workbook = XLSX.readFile(`${path}/${ctx.params.filename}`);
				const sheetName = workbook.SheetNames[0];
				const sheet = workbook.Sheets[sheetName];
				const user: OnBoardUser[] = XLSX.utils.sheet_to_json(sheet, {
					raw: false,
					dateNF: "yyyy-mm-dd",
				});
				try {
					const totalUser = await this.userCount();
					const newUserId = totalUser[0].id + 1;
					for (const userData of user) {
						if (
							!userData.primary_contact_number ||
							!userData.primary_email_address ||
							!userData.first_name ||
							!userData.last_name ||
							!userData.is_onboarding
						) {
							failedUserData.push(userData);
							continue;
						}

						const [userRecord, existEmailEmployee] = await prisma.$transaction([
							prisma.nucleus_user_main.findFirst({
								where: { primary_email_address: userData.primary_email_address },
							}),
							prisma.nucleus_employee_main.findFirst({
								where: { email_address: userData.primary_email_address },
							}),
						]);
						if (userRecord?.id || existEmailEmployee?.id) {
							duplicateUserData.push(userData);
						} else {
							userData.created_date = new Date();
							userData.modified_date = new Date();
							userData.date_of_joining = new Date();
							userData.invite_user = "Invite Sent";
							userData.role = "Dept.User";
							userData.user_code = newUserId.toString();
							userData.is_onboarding =
								userData.is_onboarding.toString() === "TRUE" ? true : false;
							userData.created_by = ctx.meta.user.id;
							userData.modified_by = ctx.meta.user.id;
							uniqueUserData.push(userData);
							email.push(userData?.primary_email_address);
							firstName.push(userData.first_name);
						}
					}
					if (uniqueUserData) {
						insertedData = await prisma.nucleus_user_main.createMany({
							data: uniqueUserData as unknown as OnBoardUser,
						});
						if (insertedData.count) {
							this.logger.info(`Bulk upload inserted successfully`);
							const sid: string = uuid();
							const token = await this.generateJWT(sid);
							const addedToken = await prisma.session.create({
								data: {
									sid: sid,
									token: token,
								},
							});
							if (addedToken.sid) this.logger.info(`Token added to session table`);
							else this.logger.info(`Error occured while adding session`);
							const response = await this.sentInvitation(email, firstName, token);
							if (response) this.logger.info(`Email invitation sent successfully`);
							else this.logger.info(`Error occured while sending invitation`);
						} else {
							failedUserData.push(...uniqueUserData);
							this.logger.info(`Failed to upload bulk data`);
						}
					}
				} catch (err) {
					failedUserData.push(user as unknown as OnBoardUser);
				} finally {
					await prisma.$disconnect();
					fs.unlink(`${path}/${ctx.params.filename}`, (err) => {
						if (err) {
							this.logger.info(`An error occurred ${err.message}`);
						} else {
							this.logger.info(`Deleted the file under ${path}`);
						}
					});

					return {
						status: true,
						total_rows_inserted: insertedData?.count ?? 0,
						total_duplicate_rows: duplicateUserData.length,
						total_failed_count: failedUserData.length,
						duplicateData: duplicateUserData,
						failedData: failedUserData,
					};
				}
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {
		async sentInvitation(to: string[], firstName: string, token: string) {
			const emailInvitation = "invitation";
			const receipents = {
				to: to,
				subject: "Invitation for Nira Onboarding Acceptance",
				data: `${process.env.SERVER_ROOT_URI}/invitation?expiresin=${token}`,
				name: firstName,
			};

			const emailresult = await sendEmail(emailInvitation, receipents);
			if (emailresult.accepted?.length) {
				return true;
			} else {
				return false;
			}
		},

		async generateJWT(sid: string) {
			const today = new Date();
			const exp = new Date(today);
			exp.setDate(today.getDate() + 7);

			return jwt.sign(
				{
					id: sid,
					service: "api",
					exp: Math.floor(exp.getTime() / 1000),
				},
				this.settings.JWT_SECRET,
			);
		},

		async userCount() {
			try {
				const totalUser = await prisma.nucleus_user_main.findMany({
					orderBy: { id: "desc" },
				});
				return totalUser;
			} catch (err) {
				this.logger.error(`Error occured while getting user count`);
				throw err.message;
			} finally {
				await prisma.$disconnect();
			}
		},
	},
};

export default MiscellaneousService;
