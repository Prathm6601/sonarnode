import type { Context, ServiceSchema } from "moleculer";
import type { ApiSettingsSchema, GatewayResponse, IncomingRequest, Route } from "moleculer-web";
import ApiGateway from "moleculer-web";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { Server } from "socket.io";
require("dotenv").config();
import serveStatic from "serve-static";
import path from "path";

const io = new Server({
	serveClient: false,
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		allowedHeaders: ["my-custom-header"],
		credentials: true,
	},
});

const prisma = new PrismaClient();

interface Meta {
	userAgent?: string | null | undefined;
	user?: object | null | undefined;
}

const ApiService: ServiceSchema<ApiSettingsSchema> = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		// Exposed port
		port: process.env.PORT != null ? Number(process.env.PORT) : 5771,

		// Exposed IP
		ip: "0.0.0.0",

		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],

		https: {
			key: fs.readFileSync(String(process.env.KEY)),
			cert: fs.readFileSync(String(process.env.CERT)),
		},

		// Global CORS settings for all routes
		cors: {
			// Configures the Access-Control-Allow-Origin CORS header.
			origin: "*",
			// Configures the Access-Control-Allow-Methods CORS header.
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
			// Configures the Access-Control-Allow-Headers CORS header.
			allowedHeaders: ["*"],
			// Configures the Access-Control-Expose-Headers CORS header.
			exposedHeaders: [],
			// Configures the Access-Control-Allow-Credentials CORS header.
			credentials: false,
			// Configures the Access-Control-Max-Age CORS header.
			maxAge: 3600,
		},

		routes: [
			{
				path: "/api",

				cors: {
					origin: [String(process.env.UI_ROOT_URI)],
					methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
					credentials: true,
				},

				whitelist: ["**"],

				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [serveStatic(path.join(__dirname, "public")) as any],

				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: true,

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: false,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: true,

				aliases: {
					// File upload from HTML form and overwrite busboy config
					"POST /uploadfile": {
						type: "multipart",
						// Action level busboy config
						busboyConfig: {
							limits: {
								files: 10,
								fileSize: 5 * 1024 * 1024,
							},
						},
						action: "orgsetup.fileUpload",
					},
					"POST /jobopeningfiles": {
						type: "multipart",
						// Action level busboy config
						busboyConfig: {
							limits: {
								files: 10,
								fileSize: 5 * 1024 * 1024,
							},
						},
						action: "jobopening.fileUpload",
					},
					"POST /userfiles": {
						type: "multipart",
						// Action level busboy config
						busboyConfig: {
							limits: {
								files: 10,
								fileSize: 5 * 1024 * 1024,
							},
						},
						action: "user.fileUpload",
					},
				},
				bodyParsers: {
					json: {
						strict: false,
						limit: "5MB",
					},
					urlencoded: {
						extended: true,
						limit: "5MB",
					},
				},
				busboyConfig: {
					limits: {
						files: 20,
					},
				},

				callOptions: {
					meta: {
						a: 10,
					},
				},

				mappingPolicy: "all",

				// Enable/disable logging
				logging: true,
			},
		],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,

		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		assets: {
			folder: "public",

			// Options to `server-static` module
			options: {},
		},
	},

	started() {
		// Create a Socket.IO instance, passing it our server
		this.io = io.listen(this.server);
		const checkedInUsers = new Map();
		const checkedOutUsers = new Map();
		let dateArray: Array<{ check_in: Date; check_out: Date }> = [];
		let dateObject = { check_in: new Date(), check_out: new Date() };
		// Add a connect listener
		this.io.on("connection", (client: any) => {
			this.logger.info("Client connected via websocket!");
			this.io
				.to(client.id)
				.emit("initialCheckedInUsers", Array.from(checkedInUsers.values()));
			this.io
				.to(client.id)
				.emit("initialCheckedOutUsers", Array.from(checkedOutUsers.values()));

			client.on("checkIn", async (employee_id: number) => {
				if (checkedInUsers.has(client.id)) {
					this.io.to(client.id).emit("checkInError", {
						error: "User is already checked in.",
					});
					return;
				}
				let currentTime = new Date();
				let currentOffset = currentTime.getTimezoneOffset();
				let ISTOffset = 330;
				const check_in = new Date(
					currentTime.getTime() + (ISTOffset + currentOffset) * 60000,
				);
				const shift = await this.getDynamicallyDeterminedShiftID(check_in);
				this.logger.info(`Shift: ${JSON.stringify(shift)} checked in at ${check_in}`);

				const checkInStatus = this.calculateCheckInStatus(check_in, shift.from);
				this.logger.info(
					`Check-in Status: ${checkInStatus.status} at ${check_in}, Time Difference: ${checkInStatus.timeDifference}`,
				);
				const currentDate = check_in.toISOString();

				const existingEntry = await prisma.nucleus_attendance_main.findFirst({
					where: {
						employee_id,
						date: currentDate,
					},
				});

				dateObject.check_in = check_in;

				if (!existingEntry) {
					dateArray = [];
					await prisma.nucleus_attendance_main.create({
						data: {
							employee_id,
							check_in,
							attendance_medium: "Websocket",
							shift_id: 4,
							date: currentDate,
							attendance_status: "Present",
							attendance_setting_id: 1,
							is_active: true,
							created_by: shift.id,
							total_hours: "00:00:00",
							multiple_in_out: dateArray,
						},
					});
				}

				const checkInData = await prisma.nucleus_attendance_main.findFirst({
					where: {
						employee_id,
						date: currentDate,
					},
				});
				this.logger.info("step-2 checkInData", checkInData?.employee_id);
				checkedInUsers.set(client.id, { checkInData, checkInStatus });
				// checkedInUsers.set(client.id, { checkInData });

				this.logger.info(
					`Response data for check-in: ${JSON.stringify(
						checkInData,
					)} checked in at ${check_in}`,
				);
				this.io.emit("updateCheckedInUsers", Array.from(checkedInUsers.values()));

				this.io.emit("checkIn", {
					employee_id,
					check_in,
					checkInStatus,
					data: checkInData,
				});
			});

			client.on("checkOut", async (employee_id: number) => {
				if (checkedOutUsers.has(client.id)) {
					this.io.to(client.id).emit("checkOutError", {
						error: "User is already checked out.",
					});
					return;
				}
				let currentTime = new Date();
				let currentOffset = currentTime.getTimezoneOffset();
				let ISTOffset = 330;
				const check_out = new Date(
					currentTime.getTime() + (ISTOffset + currentOffset) * 60000,
				);
				this.logger.info(`User ${employee_id} checked out at ${check_out}`);
				dateObject.check_out = check_out;
				this.logger.info("checkout", check_out, dateObject);
				let transformedObject = {
					check_in: dateObject.check_in,
					check_out: dateObject.check_out,
				};
				this.logger.info("transformedObject", check_out, dateObject);
				dateArray.push(transformedObject);
				this.logger.info("dateArray", dateArray);

				const updateid = await prisma.nucleus_attendance_main.findFirst({
					where: {
						employee_id,
						date: dateObject.check_in.toISOString(),
					},
				});

				const empid = updateid?.id;
				this.logger.info("updateid", updateid);
				const result = await prisma.nucleus_attendance_main.update({
					where: { id: empid },
					data: { multiple_in_out: dateArray },
				});
				this.logger.info("step 3", result);
				const lastCheckInRecord = await prisma.nucleus_attendance_main.findFirst({
					where: {
						employee_id,
						check_out: null,
					},
					orderBy: {
						check_in: "desc",
					},
				});
				this.logger.info(
					`Last Check-in Record: ${JSON.stringify(
						lastCheckInRecord,
					)} checked out at ${check_out}`,
				);

				if (lastCheckInRecord && lastCheckInRecord.shift_id !== null) {
					const shift = await prisma.nucleus_shift_main.findUnique({
						where: {
							id: lastCheckInRecord.shift_id,
						},
					});

					const checkOutStatus = this.calculateCheckOutStatus(check_out, shift?.to || "");
					this.logger.info(
						`Check-out Status: ${checkOutStatus.status} at ${check_out}, Time Difference: ${checkOutStatus.timeDifference}`,
					);

					const total_hours = this.calculateTotalHoursWithBreaks(
						lastCheckInRecord.check_in,
						check_out,
						shift?.from || "",
						shift?.to || "",
					);
					this.logger.info(
						`Total Hours: ${JSON.stringify(total_hours)} checked out at ${check_out}`,
					);

					const checkOutData = await prisma.nucleus_attendance_main.update({
						where: { id: lastCheckInRecord.id },
						data: {
							check_out,
							total_hours,
							is_active: false,
							multiple_in_out: dateArray,
						},
					});
					let data = checkedOutUsers.set(client.id, { checkOutData, total_hours });
					this.logger.info("data from chekout", data);

					this.logger.info(
						`Response data for check-out: ${JSON.stringify(
							checkOutData,
						)} checked out at ${check_out}`,
					);
					this.io.emit("updateCheckedOutUsers", Array.from(checkedOutUsers.values()));

					this.io.emit("checkOut", {
						employee_id,
						check_out,
						checkOutStatus,
						data: checkOutData,
					});
				}
			});

			client.on(
				"call",
				(
					{ action, params, opts }: { action: string; params: any; opts: any },
					done: (res: any) => void,
				) => {
					this.logger.info(
						"Received request from client! Action:",
						action,
						", Params:",
						params,
					);

					this.broker
						.call(action, params, opts)
						.then((res) => {
							if (done) done(res);
						})
						.catch((err) => this.logger.error(err));
				},
			);

			client.on("disconnect", () => {
				this.logger.info("Client disconnected");
			});
		});
	},
	methods: {
		/**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 */
		authenticate(
			ctx: Context,
			route: Route,
			req: IncomingRequest,
		): Record<string, unknown> | null {
			//Read token from cookie
			const cookievalue = req.headers.cookie;
			const cookies = cookievalue?.split(";") ?? "";
			for (const cookie of cookies) {
				const [cookieName, cookieValue] = cookie.split("=");
				if (cookieName && cookieValue) return { authToken: cookieValue };
			}

			// Read the token from header
			const auth = req.headers.authorization;

			if (auth && auth.startsWith("Bearer")) {
				const token = auth.slice(7);
				if (token) return { authToken: token };
				// Check the token. Tip: call a service which verify the token. E.g. `accounts.resolveToken`
				if (token === "123456") {
					// Returns the resolved user. It will be set to the `ctx.meta.user`
					return { id: 1, name: "John Doe" };
				}
				// Invalid token
				throw new ApiGateway.Errors.UnAuthorizedError(
					ApiGateway.Errors.ERR_INVALID_TOKEN,
					null,
				);
			} else {
				// No token. Throw an error or do nothing if anonymous access is allowed.
				// throw new E.UnAuthorizedError(E.ERR_NO_TOKEN);
				return null;
			}
		},
		calculateCheckInStatus(
			checkInTime: Date,
			shiftStartTime: string,
		): { status: string; timeDifference: string } {
			const shiftStart = new Date(`${checkInTime.toDateString()} ${shiftStartTime}`);
			const timeDifference = this.formatTimeDifference(
				shiftStart.getTime() - checkInTime.getTime(),
			);

			if (checkInTime < shiftStart) {
				return { status: "Early Check-in", timeDifference };
			} else if (checkInTime > shiftStart) {
				return { status: "Late Check-in", timeDifference };
			} else {
				return { status: "On Time", timeDifference };
			}
		},

		calculateCheckOutStatus(
			checkOutTime: Date,
			shiftEndTime: string,
		): { status: string; timeDifference: string } {
			const shiftEnd = new Date(`${checkOutTime.toDateString()} ${shiftEndTime}`);
			const timeDifference = this.formatTimeDifference(
				checkOutTime.getTime() - shiftEnd.getTime(),
			);

			if (checkOutTime < shiftEnd) {
				return { status: "Early Checkout", timeDifference };
			} else if (checkOutTime > shiftEnd) {
				return { status: "Late Checkout", timeDifference };
			} else {
				return { status: "On Time", timeDifference };
			}
		},
		formatTimeDifference(timeDifference: number): string {
			const hours = Math.floor(timeDifference / (60 * 60 * 1000))
				.toString()
				.padStart(2, "0");
			const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000))
				.toString()
				.padStart(2, "0");

			return `${hours}:${minutes}`;
		},
		async getDynamicallyDeterminedShiftID(currentTime: Date) {
			const shifts = await prisma.nucleus_shift_main.findMany();
			this.logger.info("shifts", shifts);

			const shift = shifts.find((s) => {
				const shiftStart = new Date(`${currentTime.toDateString()} ${s.from}`);
				this.logger.info("shiftStart", JSON.stringify(shiftStart));
				const shiftEnd = new Date(`${currentTime.toDateString()} ${s.to}`);
				this.logger.info("shiftEnd", JSON.stringify(shiftEnd));
				return currentTime >= shiftStart && currentTime <= shiftEnd;
			});
			this.logger.info("shifts=====================", JSON.stringify(shift));

			if (!shift) {
				throw new Error("No shift found for the current time");
			}

			return shift;
		},
		calculateTotalHours(checkIn: Date, checkOut: Date): number {
			const milliseconds = checkOut.getTime() - checkIn.getTime();
			const totalHours = milliseconds / (1000 * 60 * 60);
			return totalHours;
		},

		calculateTotalHoursWithBreaks(checkInTime: Date, checkOutTime: Date): string {
			const totalMilliseconds = checkOutTime.getTime() - checkInTime.getTime();
			const totalHours = this.millisecondsToHHMMSS(totalMilliseconds);
			return totalHours;
		},
		calculateWorkHours(
			checkInTime: Date,
			checkOutTime: Date,
			shiftStartTime: string,
			shiftEndTime: string,
		): Date {
			const shiftStart = this.convertTimeStringToDate(shiftStartTime);
			const shiftEnd = this.convertTimeStringToDate(shiftEndTime);

			let workHours = new Date(checkOutTime.getTime() - checkInTime.getTime());

			if (checkOutTime < checkInTime) {
				workHours = new Date(workHours.getTime() + 24 * 60 * 60 * 1000);
			}

			if (workHours > shiftEnd) {
				workHours = new Date(shiftEnd.getTime() - shiftStart.getTime());
			}

			return workHours;
		},

		convertTimeStringToDate(timeString: string): Date {
			const [hours, minutes, period] = timeString.split(/:|\s/);
			let hour = parseInt(hours, 10);

			if (period.toLowerCase() === "pm" && hour < 12) {
				hour += 12;
			} else if (period.toLowerCase() === "am" && hour === 12) {
				hour = 0;
			}

			const date = new Date();
			date.setHours(hour, parseInt(minutes, 10), 0, 0);

			return date;
		},
		millisecondsToHHMMSS(ms) {
			const seconds = Math.floor(ms / 1000);
			const hours = Math.floor(seconds / 3600);
			const minutes = Math.floor((seconds % 3600) / 60);
			const remainingSeconds = seconds % 60;

			const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
				.toString()
				.padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
			return formattedTime;
		},

		/**
		 * Authorize the request. Check that the authenticated user has right to access the resource.
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 */
		authorize(ctx: Context<null, Meta>, route: Route, req: IncomingRequest) {
			// Get the authenticated user.
			const { user } = ctx.meta;

			// It check the `auth` property in action schema.
			if (req.$action.auth === "required" && !user) {
				throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS", null);
			}
		},
	},
};

export default ApiService;
