import { PrismaClient } from "@prisma/client";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import type { ServiceSchema } from "moleculer";
import { Errors } from "moleculer";

require("dotenv").config();

const JWT_SECRET = String(process.env.JWT_SECRET);
const prisma = new PrismaClient();

const { MoleculerClientError } = Errors;
const GuardService: ServiceSchema = {
	name: "guard",

	/**
	 * Actions
	 */
	actions: {
		/**
		 * Check token & services
		 */
		check: {
			params: {
				token: "string",
				services: { type: "array", items: "string" },
			},
			handler(ctx: { params: { token: string; services: string[] } }) {
				return this.verifyJWT(ctx.params.token, ctx.params.services, ctx);
			},
		},

		/**
		 * Generate a JWT token for services.
		 * @param {Context} ctx
		 */
		generate: {
			params: {
				service: "string",
			},
			handler(ctx: { params: { service: string } }) {
				this.logger.warn("Only for development!");
				return this.generateJWT(ctx.params.service);
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Generate a JWT token for services
		 *
		 * @param {String} service
		 */
		generateJWT(service: string): Promise<string> {
			// eslint-disable-next-line consistent-return
			return new Promise((resolve, reject) => {
				jwt.sign({ service }, JWT_SECRET, (err: any, token: any) => {
					if (err) {
						this.logger.warn("JWT token generation error:", err);
						return reject(
							new MoleculerClientError(
								"Unable to generate token",
								500,
								"UNABLE_GENERATE_TOKEN",
							),
						);
					}

					resolve(token);
				});
			});
		},

		/**
		 * Verify a JWT token and check the service name in payload
		 *
		 * @param {String} token
		 * @param {Array<String>?} services
		 */
		verifyJWT(token: string, services?: string[], ctx?: any): Promise<void> {
			return new Promise((resolve, reject) => {
				// eslint-disable-next-line consistent-return
				jwt.verify(token, JWT_SECRET, async (err, decoded: any) => {
					if (err instanceof TokenExpiredError) {
						return reject(
							new MoleculerClientError("Token is Expired", 401, "Expired_TOKEN"),
						);
					}
					if (err) {
						this.logger.warn("JWT verifying error:", err);
						return reject(
							new MoleculerClientError("Invalid token", 401, "INVALID_TOKEN"),
						);
					}

					if (services && services.indexOf(decoded.service) === -1) {
						this.logger.warn("Forbidden service!");
						return reject(
							new MoleculerClientError("Forbidden", 401, "FORBIDDEN_SERVICE"),
						);
					}

					const data = await prisma.blacklist.findFirst({ where: { token: token } });
					if (data)
						return reject(
							new MoleculerClientError("Please Login", 401, "INVALID_TOKEN"),
						);
					ctx.meta.user.id = decoded.id;

					resolve();
				});
			});
		},
	},
};

export default GuardService;
