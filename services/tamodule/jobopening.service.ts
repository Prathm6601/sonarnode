import type { Service, ServiceSchema, Context } from "moleculer";
import { PrismaClient } from "@prisma/client";
import { JobPosting } from "../../types/jobopening";
import { Errors } from "moleculer";
import * as path from "path";
import * as mkdirp from "mkdirp";
import * as fs from "fs";
import XLSX from "xlsx";
const uploadDir = path.resolve("public");
mkdirp.sync(uploadDir);

const { MoleculerClientError } = Errors;
let fileUrl: string;
let fileName: string;

interface JobOpeningSettings {
	defaultName: string;
}
export interface JobOpeningEntity {
	job_summary: string;
	other: string;
}

export type JobOpeningParams = Partial<JobOpeningEntity>;
interface JobOpeningMethods {
	uppercase(str: string): string;
}

export type JobOpeningCreateParams = Partial<JobOpeningEntity>;
interface JobOpeningMethods {
	uppercase(str: string): string;
}

interface JobOpeningLocalVars {
	myVar: string;
}

type organizationThis = Service<JobOpeningSettings> & JobOpeningMethods & JobOpeningLocalVars;
// Create an instance of the Prisma client
const prisma = new PrismaClient();

const JobOpeningService: ServiceSchema<JobOpeningSettings> = {
	name: "jobopening",

	settings: {
		defaultName: "Moleculer",
	},
	hooks: {
		before: {
			"updateJobOpeningz*": [
				async function (ctx: Context<JobOpeningCreateParams>) {
					ctx.params.job_summary = fileUrl;
					ctx.params.other = fileUrl;
				},
			],
		},
	},
	actions: {
		//Upload file
		fileUpload: {
			handler(ctx) {
				return new Promise<{ fileUrl: string; meta: any }>((resolve, reject) => {
					fileName = ctx.meta.filename || this.randomName();
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
		// create Job Opening
		createMrf: {
			rest: {
				method: "POST",
				path: "/createmrf",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const postingTitle = ctx.params.posting_title;
					const departmentId = ctx.params.department_id;
					const existPostingTitle = await prisma.nova_manpower_requisition_main.findFirst(
						{
							where: {
								posting_title: {
									equals: postingTitle,
									mode: "insensitive",
								},
								department_id: {
									equals: Number(departmentId),
								},
							},
						},
					);

					if (existPostingTitle) {
						return {
							status: false,
							message: `Posting Title : ${postingTitle} already exists for Department ID ${departmentId}`,
						};
					}

					if (ctx.params.date_opened > ctx.params.target_date)
						return {
							status: false,
							message: "Target-date must be greater than date opened",
						};
					const createNovaManPower = await prisma.nova_manpower_requisition_main.create({
						data: ctx.params,
					});
					return {
						status: true,
						message: "Job Opening Created Successfully",
					};
				} catch (err) {
					throw new Error("Failed to create Job Opening");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		// Get All Job Opening
		getMrf: {
			rest: {
				method: "GET",
				path: "/getmrf",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const page = parseInt(ctx.params.page) || 0;
					const pageSize = parseInt(ctx.params.pageSize) || 5;

					const [data, totalCount] = await prisma.$transaction([
						prisma.nova_manpower_requisition_main.findMany({
							skip: page,
							take: pageSize,
							orderBy: {
								date_opened: "desc",
							},
							select: {
								id: true,
								posting_title: true,
								number_of_positions: true,
								qualification_required_desired: true,
								reason_for_requirement: true,
								job_opening_status: true,
								date_opened: true,
								target_date: true,
								priority: true,
								secondary_skill_set: true,
								budget: true,
								city: true,
								country: true,
								state: true,
								postal_code: true,
								remote_job: true,
								job_description: true,
								first_level_approval: true,
								second_level_approval: true,
								third_level_approval: true,
								job_summary: true,
								other: true,
								date_closed: true,
								publish: true,
								associated_tag: true,
								last_activity_time: true,
								client: true,
								number_of_associated_candidates: true,
								is_active: true,
								created_date: true,
								modified_date: true,
								department: {
									select: {
										id: true,
										name: true,
									},
								},
								industry: {
									select: {
										id: true,
										name: true,
									},
								},

								salary: {
									select: {
										id: true,
										name: true,
									},
								},
								skillset: {
									select: {
										id: true,
										name: true,
									},
								},
								team: {
									select: {
										id: true,
										name: true,
									},
								},
								hiringmanager: {
									select: {
										id: true,
										first_name: true,
										last_name: true,
									},
								},
								assignedrecruiter: {
									select: {
										id: true,
										first_name: true,
										last_name: true,
									},
								},
								jobtype: {
									select: {
										id: true,
										name: true,
									},
								},
								firstlevelapprover: {
									select: {
										id: true,
										first_name: true,
										last_name: true,
									},
								},
								secondlevelapprover: {
									select: {
										id: true,
										first_name: true,
										last_name: true,
									},
								},
								thirdlevelapprover: {
									select: {
										id: true,
										first_name: true,
										last_name: true,
									},
								},
								workexperience: {
									select: {
										id: true,
										name: true,
									},
								},
								createdby: {
									select: {
										id: true,
										first_name: true,
										last_name: true,
									},
								},
								modifiedby: {
									select: {
										id: true,
										first_name: true,
										last_name: true,
									},
								},
							},
						}),
						prisma.nova_manpower_requisition_main.count(),
					]);

					return {
						status: true,
						data: data,
						totalCount: totalCount,
					};
				} catch (error) {
					throw new Error("Failed to fetch Job Openings");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		// Get Mrf By Id
		getMrfById: {
			rest: {
				method: "GET",
				path: "getmrf/:id",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const id = Number(ctx.params.id);
					const mrfid = await prisma.nova_manpower_requisition_main.findUnique({
						where: {
							id: id,
						},
					});
					if (!mrfid)
						return {
							status: false,
							message: `Record with id: ${ctx.params.id} does not exist`,
						};

					const data = await prisma.nova_manpower_requisition_main.findFirst({
						select: {
							posting_title: true,
							number_of_positions: true,
							qualification_required_desired: true,
							reason_for_requirement: true,
							job_opening_status: true,
							date_opened: true,
							target_date: true,
							priority: true,
							secondary_skill_set: true,
							budget: true,
							city: true,
							country: true,
							state: true,
							postal_code: true,
							remote_job: true,
							job_description: true,
							first_level_approval: true,
							second_level_approval: true,
							third_level_approval: true,
							job_summary: true,
							other: true,
							date_closed: true,
							publish: true,
							associated_tag: true,
							last_activity_time: true,
							client: true,
							number_of_associated_candidates: true,
							is_active: true,
							created_date: true,
							modified_date: true,
							department: {
								select: {
									id: true,
									name: true,
								},
							},
							industry: {
								select: {
									id: true,
									name: true,
								},
							},

							salary: {
								select: {
									id: true,
									name: true,
								},
							},
							skillset: {
								select: {
									id: true,
									name: true,
								},
							},
							team: {
								select: {
									id: true,
									name: true,
								},
							},
							hiringmanager: {
								select: {
									id: true,
									first_name: true,
									last_name: true,
								},
							},
							assignedrecruiter: {
								select: {
									id: true,
									first_name: true,
									last_name: true,
								},
							},
							jobtype: {
								select: {
									id: true,
									name: true,
								},
							},
							firstlevelapprover: {
								select: {
									id: true,
									first_name: true,
									last_name: true,
								},
							},
							secondlevelapprover: {
								select: {
									id: true,
									first_name: true,
									last_name: true,
								},
							},
							thirdlevelapprover: {
								select: {
									id: true,
									first_name: true,
									last_name: true,
								},
							},
							workexperience: {
								select: {
									id: true,
									name: true,
								},
							},
							createdby: {
								select: {
									id: true,
									first_name: true,
									last_name: true,
								},
							},
							modifiedby: {
								select: {
									id: true,
									first_name: true,
									last_name: true,
								},
							},
						},
						where: { id: mrfid.id },
					});
					return data;
				} catch (error) {
					throw new Error("Failed to Fetch Job Opening");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//update Job Opening
		updateMrf: {
			rest: {
				method: "PUT",
				path: "/updatemrf/:id",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const id = Number(ctx.params.id);
					const mrfExistData = await prisma.nova_manpower_requisition_main.findUnique({
						where: {
							id: id,
						},
					});
					if (!mrfExistData)
						// throw new Error(`Record with id: ${ctx.params.id} does not exist`);
						return {
							status: false,
							message: `Record with id: ${ctx.params.id} does not exist`,
						};

					delete ctx.params.id;

					const data = await prisma.nova_manpower_requisition_main.update({
						where: { id: mrfExistData.id },
						data: ctx.params,
					});

					return { status: true, message: "Job Opening updated succesfully" };
				} catch (error) {
					throw new Error("Failed to update Job Opening");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		// Get Department
		getDepartment: {
			rest: {
				method: "GET",
				path: "/getdepartment",
			},
			restricted: ["api"],

			async handler() {
				try {
					const data = await prisma.nucleus_department_main.findMany({
						select: { id: true, name: true },
					});
					return {
						status: true,
						data: data,
					};
				} catch (error) {
					throw new Error("Failed to fetch Nova Department");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		// get Team
		getTeam: {
			rest: {
				method: "GET",
				path: "/getteam",
			},
			restricted: ["api"],

			async handler() {
				try {
					const data = await prisma.nova_team_main.findMany({
						select: {
							id: true,
							name: true,
						},
					});
					return {
						status: true,
						data: data,
					};
				} catch (error) {
					throw new Error("Failed to fetch Nova Team");
				} finally {
					await prisma.$disconnect();
				}
			},
		},
		//get Industry
		getIndustry: {
			rest: {
				method: "GET",
				path: "/getindustry",
			},
			restricted: ["api"],
			async handler() {
				try {
					const response = await prisma.nova_industry_main.findMany({
						select: { id: true, name: true },
					});
					return {
						status: true,
						data: response,
						message: `Fetched Industry details successfully`,
					};
				} catch (error) {
					throw new Error("Failed to fetch Industry");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//get All Employees
		getAllEmployees: {
			rest: {
				method: "GET",
				path: "/getallemployees",
			},
			restricted: ["api"],
			async handler() {
				try {
					const response = await prisma.nucleus_employee_main.findMany({
						select: { id: true, first_name: true, last_name: true },
					});
					return {
						status: true,
						data: response,
						message: `Fetched Employees details successfully`,
					};
				} catch (error) {
					console.error("Error fetching Employees:", error);
					throw new Error("Failed to fetch Employees");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//Get Job Type
		getJobType: {
			rest: {
				method: "GET",
				path: "/getjobtype",
			},
			restricted: ["api"],
			async handler() {
				try {
					const response = await prisma.nova_job_type_main.findMany({
						select: { id: true, name: true },
					});
					return {
						status: true,
						data: response,
						message: "Fetched Job Type details successfully",
					};
				} catch (error) {
					throw new Error("Failed to fetch Job Type ");
				} finally {
					await prisma.$disconnect();
				}
			},
		},
		//Get Work Experience
		getWorkExperience: {
			rest: {
				method: "GET",
				path: "/getworkexperience",
			},
			restricted: ["api"],
			async handler() {
				try {
					const response = await prisma.nova_work_experience_main.findMany({
						select: { id: true, name: true },
					});
					return {
						status: true,
						data: response,
						message: "Fetched Work Exprience details successfully",
					};
				} catch (error) {
					throw new Error("Failed to fetch Work Exprience");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//Get Skill Set
		getSkillSet: {
			rest: {
				method: "GET",
				path: "/getskillset",
			},
			restricted: ["api"],
			async handler() {
				try {
					const response = await prisma.nova_skillset_main.findMany({
						select: { id: true, name: true },
					});
					return {
						status: true,
						data: response,
						message: "Fetched Skill Set details successfully",
					};
				} catch (error) {
					throw new Error("Failed to fetch Skill Set");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//Get Salary Range
		getSalaryRange: {
			rest: {
				method: "GET",
				path: "/getsalaryrange",
			},
			restricted: ["api"],
			async handler() {
				try {
					const response = await prisma.nova_salary_range_main.findMany({
						select: { id: true, name: true },
					});
					return {
						status: true,
						data: response,
						message: "Fetched Salary Range details successfully",
					};
				} catch (error) {
					throw new Error("Failed to fetch Salary Range");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		createJobOpening: {
			rest: { method: "POST", path: "/createjobopenings" },
			restricted: ["api"],
			async handler(ctx) {
				const checkFileType = fileName.split(".");
				if (checkFileType[checkFileType.length - 1] != "xlsx")
					throw new MoleculerClientError(
						"Please upload xlsx format file",
						401,
						"INVALID_FORMAT_ERROR",
					);
				try {
					const filePath = path.join(uploadDir, fileName);
					const workbook = XLSX.readFile(filePath);
					const sheetName = workbook.SheetNames[0];
					const sheet = workbook.Sheets[sheetName];

					const JobOpeningList: JobPosting[] = XLSX.utils.sheet_to_json(sheet, {
						raw: false,
						defval: null,
						blankrows: false,
						dateNF: "yyyy-mm-dd",
					});
					//removing spaces
					const cleanedJobOpeningList = JobOpeningList.map((entry) => {
						const cleanedEntry: Record<string, any> = {};
						for (const field in entry) {
							if (Object.prototype.hasOwnProperty.call(entry, field)) {
								const value = entry[field as keyof JobPosting];
								cleanedEntry[field] =
									value !== null && value !== undefined
										? String(value).trim()
										: value;
							}
						}
						return cleanedEntry;
					});
					const createdJobOpening = [];
					for (const entry of cleanedJobOpeningList) {
						const {
							posting_title,
							department_id,
							number_of_positions,
							job_type_id,
							work_experience_id,
							date_opened,
							target_date,
							priority,
							first_level_approval,
							first_level_approver,
						} = entry;

						for (const field in entry) {
							const value = entry[field as keyof JobPosting];

							if (value === null || value === undefined || value === "") {
								return {
									status: false,
									message: `${field} is required and cannot be empty.`,
								};
							}
						}

						const dateOpened = new Date(date_opened);
						const isValidDateOpened =
							!isNaN(dateOpened.getTime()) &&
							dateOpened.getFullYear() >= 2000 &&
							dateOpened.getMonth() >= 0 &&
							dateOpened.getMonth() <= 12 &&
							dateOpened.getDate() >= 1 &&
							dateOpened.getDate() <= 31;

						const targateDate = new Date(target_date);
						const isValidTargateDate =
							!isNaN(dateOpened.getTime()) &&
							dateOpened.getFullYear() >= 2000 &&
							dateOpened.getMonth() >= 0 &&
							dateOpened.getMonth() <= 12 &&
							dateOpened.getDate() >= 1 &&
							dateOpened.getDate() <= 31;

						if (!isValidDateOpened || !isValidTargateDate) {
							return {
								status: false,
								message: "invalid date",
							};
						}
						if (dateOpened > targateDate)
							return {
								status: false,
								message: "Target-date must be greater than date opened",
							};

						const existPostingTitle =
							await prisma.nova_manpower_requisition_main.findFirst({
								where: {
									posting_title: {
										equals: posting_title,
										mode: "insensitive",
									},
									department_id: {
										equals: Number(department_id),
									},
								},
							});

						if (existPostingTitle) {
							return {
								status: false,
								message: `Posting Title : ${posting_title} already exists for Department ID ${department_id}`,
							};
						}

						const department = await prisma.nucleus_department_main.findUnique({
							where: {
								id: Number(department_id),
							},
						});

						if (!department) {
							return {
								status: false,
								message: `Department id : ${department_id} does not exist`,
							};
						}
						const jobType = await prisma.nova_job_type_main.findUnique({
							where: {
								id: Number(job_type_id),
							},
						});

						if (!jobType) {
							return {
								status: false,
								message: `Job Type id : ${job_type_id} does not exist`,
							};
						}

						const workExperience = await prisma.nova_work_experience_main.findUnique({
							where: {
								id: Number(work_experience_id),
							},
						});

						if (!workExperience) {
							return {
								status: false,
								message: `Work Experience id : ${work_experience_id} does not exist`,
							};
						}

						const firstLevelApprover = await prisma.nucleus_employee_main.findUnique({
							where: {
								id: Number(first_level_approver),
							},
						});

						if (!firstLevelApprover) {
							return {
								status: false,
								message: `Work Experience id : ${first_level_approver} does not exist`,
							};
						}

						try {
							const response = await prisma.nova_manpower_requisition_main.createMany(
								{
									data: {
										posting_title,
										department_id: Number(department_id),
										number_of_positions,
										job_type_id: Number(job_type_id),
										work_experience_id: Number(work_experience_id),
										date_opened: new Date(date_opened),
										target_date: new Date(target_date),
										priority,
										first_level_approval,
										first_level_approver: Number(first_level_approver),
										created_by: ctx.meta.user.id,
										modified_by: ctx.meta.user.id,
										created_date: new Date(),
										modified_date: new Date(),
									},
								},
							);
							createdJobOpening.push(response);
						} catch (error) {
							throw new Error("Failed to create Job Opening");
						}
					}

					if (fs.existsSync(filePath)) {
						fs.unlinkSync(filePath);
					}

					return {
						status: true,
						message: "Job Opening created successfully",
					};
				} catch (error) {
					throw new Error("Failed to process Job Opening");
				} finally {
					await prisma.$disconnect();
				}
			},
		},
	},
};

export default JobOpeningService;
