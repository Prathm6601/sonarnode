import type { Service, ServiceSchema, Context } from "moleculer";
import {
	PrismaClient,
	nucleus_user_main,
	nucleus_user_educational_details_main,
	nucleus_user_experience_details_main,
} from "@prisma/client";
import { EducationalDetails, WorkExperienceDetails } from "../../types/userdetails";
import { Errors } from "moleculer";
import * as path from "path";
import * as mkdirp from "mkdirp";
import * as fs from "fs";
import XLSX from "xlsx";
const uploadDir = path.resolve("public");
mkdirp.sync(uploadDir);

const { MoleculerClientError } = Errors;

let fileUrl: string;

interface User {
	user_code?: string;
	salutation?: string;
	first_name?: string;
	last_name?: string;
	date_of_birth?: string;
	date_of_joining?: string;
	primary_email_address?: string;
	secondary_email_address?: string;
	primary_contact_number?: string;
	secondary_contact_number?: string;
	password?: string;
	reporting_manager_id?: string;
	offer_designation_id?: number;
	user_status?: number;
	role?: string;
	address?: string;
	state?: string;
	country?: string;
	city?: string;
	postalcode?: string;
	highest_qualification_id?: number;
	current_job_title?: string;
	current_salary?: string;
	skillset?: string;
	relevant_experience?: string;
	current_employer?: string;
	notice_period?: string;
	expected_salary?: string;
	recruiter?: number;
	profile_source_id?: number;
	job_type_id?: number;
	resume?: string;
	cover_letter?: string;
	others?: string;
	contracts?: string;
	offer?: string;
	current_location?: string;
	relocation?: boolean;
	posting_title_id?: number;
	ratings?: number;
	overall_comments?: string;
	gender?: string;
	marital_status?: string;
	emergency_contact_number?: string;
	blood_group?: string;
	profile_image?: string;
	total_experience?: string;
	permanent_address?: string;
	date_of_contract?: string;
	user_exit_status?: string;
	date_of_confirmation?: string;
	contract_end_date?: string;
	invalid_attempt?: boolean;
	lock_time?: boolean;
	password_history?: string;
	background_chk_status?: string;
	candidate_referred_by?: string;
	company_id?: string;
	is_onboarding?: boolean;
	invite_user?: string;
	is_active?: boolean;
	created_by?: number;
	modified_by?: number;
	created_date?: string;
	modified_date?: string;
	user_by: EducationalDetails[];
	user_id_by: WorkExperienceDetails[];
}

interface CandidateSettings {
	defaultName: string;
}
export interface CandidateEntity {
	photo: string;
	resume: string;
	contracts: string;
	others: string;
	cover_letter: string;
	offer: string;
	profile_image: string;
}

export type CandidateCreateParams = Partial<CandidateEntity>;
interface CandidateMethods {
	uppercase(str: string): string;
}

interface CandidateLocalVars {
	myVar: string;
}

type CandidateThis = Service<CandidateSettings> & CandidateMethods & CandidateLocalVars;
// Create an instance of the Prisma client
const prisma = new PrismaClient();

const CandidateService: ServiceSchema<CandidateSettings> = {
	name: "user",

	settings: {
		defaultName: "Moleculer",
	},
	hooks: {
		before: {
			"updateCandidate*": [
				async function (ctx: Context<CandidateEntity>) {
					ctx.params.photo = fileUrl;
					ctx.params.resume = fileUrl;
					ctx.params.contracts = fileUrl;
					ctx.params.others = fileUrl;
					ctx.params.offer = fileUrl;
					ctx.params.cover_letter = fileUrl;
					ctx.params.profile_image = fileUrl;
				},
			],
		},
	},
	actions: {
		//Upload file
		fileUpload: {
			handler(ctx) {
				return new Promise<{ fileUrl: string; meta: any }>((resolve, reject) => {
					const fileName = ctx.meta.filename || this.randomName();
					fileUrl = `${process.env.SERVER_ROOT_URI}/${fileName}`; // Replace with your actual API domain
					const filePath = path.join(uploadDir, fileName);
					const file = fs.createWriteStream(filePath);

					file.on("close", () => {
						resolve({ fileUrl, meta: ctx.meta });
					});

					ctx.params.on("error", (err: any) => {
						reject(err);
						file.destroy(err);
					});

					file.on("error", (err) => {
						fs.unlinkSync(filePath);
					});

					ctx.params.pipe(file);
				});
			},
		},
		//Get All User
		getAllUser: {
			rest: {
				method: "GET",
				path: "/getalluser",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const page = parseInt(ctx.params.page) || 0;
					const pageSize = parseInt(ctx.params.pageSize) || 5;

					const [data, totalCount] = await prisma.$transaction([
						prisma.nucleus_user_main.findMany({
							skip: page,
							take: pageSize,
							select: {
								id: true,
								salutation: true,
								first_name: true,
								last_name: true,
								primary_contact_number: true,
								secondary_contact_number: true,
								marital_status: true,
								primary_email_address: true,
								secondary_email_address: true,
								date_of_birth: true,
								address: true,
								state: true,
								country: true,
								city: true,
								postalcode: true,
								total_experience: true,
								current_job_title: true,
								current_salary: true,
								skillset: true,
								relevant_experience: true,
								current_employer: true,
								notice_period: true,
								expected_salary: true,
								date_of_joining: true,
								resume: true,
								cover_letter: true,
								others: true,
								contracts: true,
								offer: true,
								current_location: true,
								relocation: true,
								ratings: true,
								overall_comments: true,
								profile_image: true,
								is_active: true,
								created_date: true,
								modified_date: true,
								user_status_by: {
									select: {
										id: true,
										name: true,
									},
								},
								offer_designation: {
									select: {
										id: true,
										name: true,
									},
								},
								job_type: {
									select: {
										id: true,
										name: true,
									},
								},
								postingtitle: {
									select: {
										id: true,
										posting_title: true,
									},
								},
								profilesources: {
									select: {
										id: true,
										name: true,
									},
								},
								qualification: {
									select: {
										id: true,
										name: true,
									},
								},
								recruiter_by: {
									select: {
										id: true,
										first_name: true,
										last_name: true,
									},
								},
								created: {
									select: {
										id: true,
										first_name: true,
										last_name: true,
									},
								},
								modified: {
									select: {
										id: true,
										first_name: true,
										last_name: true,
									},
								},
							},
						}),
						prisma.nucleus_user_main.count(),
					]);

					return {
						status: true,
						data: data,
						totalCount: totalCount,
					};
				} catch (error) {
					throw new Error("Failed to fetch Candidates");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//create user
		createUser: {
			rest: {
				method: "POST",
				path: "/createuser",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const { user_id_by, user_by, ...userData }: User = ctx.params;

					await prisma.$transaction(async (tx) => {
						const createUser = await tx.nucleus_user_main.create({
							data: userData as unknown as nucleus_user_main,
						});
						let educationResult, experienceResult;

						if (user_by) {
							educationResult =
								await tx.nucleus_user_educational_details_main.createMany({
									data: user_by.map(
										(eduDetail: EducationalDetails) =>
											({
												user_id: createUser.id,
												is_active: createUser.is_active,
												created_date: new Date(),
												modified_date: new Date(),
												created_by: ctx.meta.user.id,
												modified_by: ctx.meta.user.id,
												...eduDetail,
											} as unknown as nucleus_user_educational_details_main),
									),
									skipDuplicates: true,
								});
						}

						if (user_id_by) {
							experienceResult =
								await tx.nucleus_user_experience_details_main.createMany({
									data: user_id_by.map(
										(expDetail: WorkExperienceDetails) =>
											({
												user_id: createUser.id,
												is_active: createUser.is_active,
												created_date: new Date(),
												modified_date: new Date(),
												created_by: ctx.meta.user.id,
												modified_by: ctx.meta.user.id,
												...expDetail,
											} as unknown as nucleus_user_experience_details_main),
									),
									skipDuplicates: true,
								});
						}
						if (educationResult && experienceResult) {
							this.logger.info(
								"education_result && experience_result created successfully",
							);
						}
					});
					return {
						status: true,
						message: "User Created Successfully",
					};
				} catch (err) {
					this.logger.info(err);
					throw new Error("Failed to create User");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		// Get user Status
		getCandidateStatus: {
			rest: {
				method: "GET",
				path: "/getcandidatestatus",
			},
			restricted: ["api"],
			async handler() {
				try {
					const response = await prisma.nucleus_user_status.findMany({
						select: { id: true, name: true, category: true },
					});
					return {
						status: true,
						data: response,
						message: "Fetched Candidate Status details successfully",
					};
				} catch (error) {
					this.logger.info("Error fetching Candidate Status:", error);
					throw new Error("Failed to fetch Candidate Status");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		// Get Profile Source
		getProfileSource: {
			rest: {
				method: "GET",
				path: "/getprofilesource",
			},
			restricted: ["api"],
			async handler() {
				try {
					const response = await prisma.nova_profile_source_main.findMany({
						select: { id: true, name: true },
					});
					return {
						status: true,
						data: response,
						message: "Fetched Profile Source details successfully",
					};
				} catch (error) {
					this.logger.info("Error fetching Profile Source:", error);
					throw new Error("Failed to fetch Profile Source");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		// Get Nova Designation_
		getDesignation: {
			rest: {
				method: "GET",
				path: "/getdesignations",
			},
			restricted: ["api"],
			async handler() {
				try {
					const response = await prisma.nova_designation_main.findMany({
						select: { id: true, name: true },
					});
					return {
						status: true,
						data: response,
						message: `Fetched Designation details successfully`,
					};
				} catch (error) {
					this.logger.info("Error fetching Designation:", error);
					throw new Error("Failed to fetch Designation");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		// Get Posting Titles
		getPostingTitle: {
			rest: {
				method: "GET",
				path: "/getpostingtitles",
			},
			restricted: ["api"],
			async handler() {
				try {
					const response = await prisma.nova_manpower_requisition_main.findMany({
						select: { id: true, posting_title: true },
					});
					return {
						status: true,
						data: response,
						message: `Fetched Posting Title details successfully`,
					};
				} catch (error) {
					this.logger.info("Error fetching Posting Title:", error);
					throw new Error("Failed to fetch Posting Title");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		// Get Qualifications
		getQualification: {
			rest: {
				method: "GET",
				path: "/getqualifications",
			},
			restricted: ["api"],
			async handler() {
				try {
					const response = await prisma.nova_highest_qualification_main.findMany({
						select: { id: true, name: true },
					});
					return {
						status: true,
						data: response,
						message: `Fetched Qualification details successfully`,
					};
				} catch (error) {
					this.logger.info("Error fetching Qualifications:", error);
					throw new Error("Failed to fetch Qualifications");
				} finally {
					await prisma.$disconnect();
				}
			},
		},
	},
	methods: {},
};

export default CandidateService;
