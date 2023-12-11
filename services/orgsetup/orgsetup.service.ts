import type { Service, ServiceSchema, Context } from "moleculer";
import { PrismaClient } from "@prisma/client";
import * as path from "path";
import * as mkdirp from "mkdirp";
import * as fs from "fs";
import XLSX from "xlsx";
import { Errors } from "moleculer";
import { ValidationUtil } from "../../validation/orgconfiguration.validation";
import { SiteValidationUtil } from "../../validation/siteconfiguration.validations";
const uploadDir = path.resolve("public");
mkdirp.sync(uploadDir);

let fileUrl: string;
const { MoleculerClientError } = Errors;

interface OrganizationSettings {
	defaultName: string;
}
export interface OrganizationEntity {
	org_image: string;
}
export interface SitePreferencesEntity {
	login_image: string;
}
export type OrganizationCreateParams = Partial<OrganizationEntity>;
interface OrganizationMethods {
	uppercase(str: string): string;
}
export type SitePreferencesParams = Partial<SitePreferencesEntity>;
interface OrganizationMethods {
	uppercase(str: string): string;
}
interface OrganizationLocalVars {
	myVar: string;
}
interface HolidayEntry {
	name: string;
	holiday: string;
	from: string;
	to: string;
}
type organizationThis = Service<OrganizationSettings> & OrganizationMethods & OrganizationLocalVars;
// Create an instance of the Prisma client
const prisma = new PrismaClient();

const OrganizationService: ServiceSchema<OrganizationSettings> = {
	name: "orgsetup",

	settings: {
		defaultName: "Moleculer",
	},
	hooks: {
		before: {
			/**
			 * Register a before hook for the `create` action.
			 * It sets a default value for the quantity field.
			 */
			"updateOrganiz*": [
				async function (ctx: Context<OrganizationCreateParams>) {
					ctx.params.org_image = fileUrl;
				},
			],
			"updateSite*": [
				async function (ctx: Context<SitePreferencesParams>) {
					ctx.params.login_image = fileUrl;
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

		// Update  organization detail
		updateOrganization: {
			rest: {
				method: "PUT",
				path: "/updateorganization/:id",
			},
			restricted: ["api"],
			params: {
				organization_name: {
					type: "string",
					custom: ValidationUtil.validateOrganizationName,
				},
				website: { type: "string", custom: ValidationUtil.validateURL },
				org_start_date: { type: "string", custom: ValidationUtil.validateDate },
				total_employees: {
					type: "string",
					custom: ValidationUtil.validateNotManualEntry,
					// values: ["0-50", "51-100", "101-500", "500-1K", "above 1K"],
					values: ["0", "1", "2", "3", "4"],
				},
				city: { type: "string", custom: ValidationUtil.validateCity },
				country: { type: "string", custom: ValidationUtil.validateCountry },
				state: { type: "string", custom: ValidationUtil.validateState },
				phone_number: { type: "string", custom: ValidationUtil.validatePhoneNumber },
				email: { type: "string", custom: ValidationUtil.validateEmail },
				registration_number: {
					type: "string",
					custom: ValidationUtil.validateRegistrationNumber,
				},
				designation: {
					type: "array",
					custom: ValidationUtil.validateDesignation,
				},
				address: {
					type: "string",
					custom: ValidationUtil.validateMainBranchAddress,
				},
				description: {
					type: "string",
					custom: ValidationUtil.validateOrganizationDescription,
				},
				org_head: {
					type: "string",
					custom: ValidationUtil.validateOrganizationHead,
				},
			},
			async handler(ctx) {
				try {
					const { id } = ctx.params;
					const existingOrganization = await prisma.nucleus_organization_main.findUnique({
						where: { id: parseInt(id) },
					});

					if (!existingOrganization) {
						return { status: false, message: "Organization not found" };
					}
					const { id: _, ...dataWithoutId } = ctx.params;

					await prisma.nucleus_organization_main.update({
						where: { id: parseInt(id) },
						data: dataWithoutId,
					});

					return {
						status: true,
						message: "Organization Information Updated Successfully",
					};
				} catch (error) {
					console.error("Error updating Organization:", error);
					throw new Error("Failed to update Organization");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		// GET organization detail
		getOrganizations: {
			rest: {
				method: "GET",
				path: "/getorganizations",
			},
			restricted: ["api"],

			async handler() {
				try {
					const data = await prisma.nucleus_organization_main.findMany();
					return {
						status: true,
						data: data,
					};
				} catch (error) {
					console.error("Error fetching organizations:", error);
					throw new Error("Failed to fetch organizations");
				} finally {
					await prisma.$disconnect();
				}
			},
		},
		// GET sitepreferences
		sitePreferences: {
			rest: {
				method: "GET",
				path: "/sitepreferences",
			},
			restricted: ["api"],
			async handler() {
				try {
					const response = await prisma.nucleus_sitepreference_main.findMany({});
					return {
						status: true,
						data: response,
						message: `Fetched sitepreference details successfully`,
					};
				} catch (error) {
					console.error("Error fetching sitepreference:", error);
					throw new Error("Failed to fetch sitepreference");
				} finally {
					await prisma.$disconnect();
				}
			},
		},
		// GET MainBusinessUnit
		getBusinessUnit: {
			rest: {
				method: "GET",
				path: "/getbusinessunits",
			},
			restricted: ["api"],
			async handler() {
				try {
					const response = await prisma.nucleus_business_unit_main.findMany({});
					return {
						status: true,
						data: response,
						message: `Fetched businessunit details successfully`,
					};
				} catch (error) {
					console.error("Error fetching businessunit:", error);
					throw new Error("Failed to fetch businessunit");
				} finally {
					await prisma.$disconnect();
				}
			},
		},
		// POST createMainBusinessUnit

		createBusinessUnits: {
			rest: {
				method: "POST",
				path: "/createbusinessunits",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const businessUnitData = ctx.params.data.map(
						(dataValue: { [x: string]: Date }) => {
							dataValue["created_date"] = new Date();
							dataValue["modified_date"] = new Date();
							dataValue["modified_by"] = ctx.meta.user.id;
							dataValue["created_by"] = ctx.meta.user.id;
							return dataValue;
						},
					);
					const createBusinessUnits = await prisma.nucleus_business_unit_main.createMany({
						data: businessUnitData,
						skipDuplicates: true,
					});
					if (createBusinessUnits.count)
						return { status: true, message: "Business units created successfully" };
					else {
						return new MoleculerClientError(
							"Failed to create business units",
							401,
							"CREATE_BUSINESS_UNITS_ERROR",
						);
					}
				} catch (err) {
					this.logger.error("Error occured while creating business units");
					throw err;
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//Rename/Drag business units
		updateBusinessUnits: {
			rest: {
				method: "PUT",
				path: "/updatebusinessunits/:id",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const id = Number(ctx.params.id);
					const businessData = await prisma.nucleus_business_unit_main.findUnique({
						where: {
							id: id,
						},
					});
					if (!businessData)
						throw new Error(`Record with ${ctx.params.id} does not exist`);
					delete ctx.params.id;
					const data1 = await prisma.nucleus_business_unit_main.update({
						where: { id: id },
						data: ctx.params,
					});
					if (data1.id)
						return {
							status: true,
							message: "Business Units updated succesfully",
						};
					else
						return new MoleculerClientError(
							"Failed to update business units",
							401,
							"UPDATE_BUSINESS_UNITS_ERROR",
						);
				} catch (error) {
					console.error("Error occured whiel updating business units:", error.message);
					throw new Error("Failed to update business units");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//Delete Business Units
		deleteBusinessUnits: {
			rest: {
				method: "DELETE",
				path: "/deletebusinessunits/:id",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const id = Number(ctx.params.id);
					const businessData = await prisma.nucleus_business_unit_main.findUnique({
						where: {
							id: id,
						},
					});
					if (!businessData) throw new Error(`Record with ${id} does not exist`);
					const data = await prisma.nucleus_business_unit_main.deleteMany({
						where: {
							id: id,
						},
					});
					if (data.count)
						return { status: true, message: "Business Units deleted successfully" };
					else {
						return new MoleculerClientError(
							"Failed to delete business units",
							401,
							"DELETE_BUSINESS_UNITS_ERROR",
						);
					}
				} catch (err) {
					this.logger.error("Failed to delete Business Units");
					throw err;
				} finally {
					await prisma.$disconnect();
				}
			},
		},
		// GET Maindmodule
		getModules: {
			rest: {
				method: "GET",
				path: "/getmodules",
			},
			restricted: ["api"],
			async handler() {
				try {
					const response = await prisma.nucleus_module_main.findMany({
						orderBy: { id: "asc" },
					});
					return {
						status: true,
						data: response,
						message: `Fetched Module details successfully`,
					};
				} catch (error) {
					console.error("Error fetching modules:", error);
					throw new Error("Failed to fetch modules");
				} finally {
					await prisma.$disconnect();
				}
			},
		},
		// Update Mainmodule
		updateModule: {
			rest: {
				method: "PUT",
				path: "/updatemodule",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					let i = 0;
					const responseValue = Promise.all(
						ctx.params.data.map(async (data: any) => {
							const id = Number(data.id);
							const entityData = await prisma.nucleus_module_main.findUnique({
								where: {
									id: id,
								},
							});
							if (!entityData)
								throw new Error(`Record with ${data.id} does not exist`);
							delete data.id;
							const data1 = await prisma.nucleus_module_main.update({
								where: { id: id },
								data: data,
							});
							if (data1.id) i++;
							return i;
						}),
					)
						.then((response) => {
							if (response.length === ctx.params.data.length) {
								return { status: true, message: "Modules updated succesfully" };
							}
						})
						.catch((err) => {
							return {
								status: false,
								message: "Failed to update module succesfully",
							};
						});
					return responseValue;
				} catch (error) {
					console.error("Error occured whiel updating module:", error.message);
					throw new Error("Failed to update module");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//PUT sitepreperance
		updateSitepreference: {
			rest: {
				method: "PUT",
				path: "/updatesitepreference/:id", // Assuming you are updating by ID
			},
			params: {
				emp_code: { type: "string", custom: SiteValidationUtil.validateEmployeeCode },
				date_format_id: { type: "string", custom: SiteValidationUtil.validateDateFormat },
				time_format_id: { type: "string", custom: SiteValidationUtil.validateTimeFormat },
				time_zone_id: { type: "string", custom: SiteValidationUtil.validateTimeZone },
				currency_id: { type: "string", custom: SiteValidationUtil.validateCurrency },
				colour_primary: {
					type: "string",
					custom: SiteValidationUtil.validatePrimaryColour,
				},
				colour_secondary: {
					type: "string",
					custom: SiteValidationUtil.validateSecondaryColour,
				},
				colour_tertiary: {
					type: "string",
					custom: SiteValidationUtil.validateTertiaryColour,
				},
				font_type: { type: "string", custom: SiteValidationUtil.validateThemeFontfamily },
				font_size: { type: "string", custom: SiteValidationUtil.validateThemeFontSize },
				password_id: { type: "string", custom: SiteValidationUtil.validateDefaultPassword },
				employment_status: {
					type: "array",
					custom: SiteValidationUtil.validateEmployeeStatus,
				},
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const { id } = ctx.params;

					const existingSitepreference =
						await prisma.nucleus_sitepreference_main.findUnique({
							where: { id: parseInt(id) },
						});

					if (!existingSitepreference) {
						return { status: false, message: `Site Configuration Not Found` };
					}

					// Create a new object without the id field
					const { id: _, ...dataWithoutId } = ctx.params;

					await prisma.nucleus_sitepreference_main.update({
						where: { id: parseInt(id) },
						data: dataWithoutId,
					});

					return { status: true, message: `Site Configuration Updated Successfully` };
				} catch (error) {
					console.error("Error Updating Site Configuration:", error.message);
					throw new Error("Failed To Update Site Configuration");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//GET DATA On FISRT LOGIN
		getInitialData: {
			rest: {
				method: "GET",
				path: "/initialdata",
			},
			async handler() {
				try {
					const data = await prisma.nucleus_sitepreference_main.findUnique({
						where: {
							id: 1,
						},
						select: {
							date_format_id: true,
							time_format_id: true,
							time_zone_id: true,
							currency_id: true,
							password_id: true,
							font_type: true,
							font_size: true,
							colour_primary: true,
							colour_secondary: true,
							colour_tertiary: true,
							login_image: true,
							country: true,
							nucleus_organization_main: true,
						},
					});

					return { status: true, data: data };
				} catch (err) {
					this.logger.error(err);
					throw new MoleculerClientError(
						"Failed to fetch initial data",
						500,
						"Initial_Load_Data_Error",
					);
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		// POST Legal Entity
		createLegalentity: {
			rest: {
				method: "POST",
				path: "/createlegalentity",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const legalEntityCount = await prisma.nucleus_legal_entity_main.count();
					const totalInput = Number(legalEntityCount) + Number(ctx.params.data.length);
					if (totalInput > 5)
						throw new MoleculerClientError(
							"Number of Legal Entity 5 already exists",
							401,
							"Legal_Entity_Error",
						);
					const legalEntityData = ctx.params.data.map(
						(dataValue: { [x: string]: Date }) => {
							dataValue["created_date"] = new Date();
							dataValue["modified_date"] = new Date();
							dataValue["modified_by"] = ctx.meta.user.id;
							dataValue["created_by"] = ctx.meta.user.id;
							return dataValue;
						},
					);
					const createLegalEntity = await prisma.nucleus_legal_entity_main.createMany({
						data: legalEntityData,
						skipDuplicates: true,
					});
					if (createLegalEntity.count)
						return { status: true, message: "Legal Entity created successfully" };
					else {
						return new MoleculerClientError(
							"Failed to create legal entity",
							401,
							"CREATE_LEGAL_ENTITY_ERROR",
						);
					}
				} catch (err) {
					this.logger.error("Error occured while creating legalentity");
					throw err.message;
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		// GET Legal Entity
		getLegalentity: {
			rest: {
				method: "GET",
				path: "/getlegalentity",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const data = await prisma.nucleus_legal_entity_main.findMany({
						include: { nucleus_organization_main: true },
					});
					return data;
				} catch (error) {
					console.error("Error occured while fetching legal entity:", error.message);
					throw new MoleculerClientError(
						"Failed to fetch Legal Entity",
						500,
						"Legal_Entity_Error",
					);
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//Rename/Drag legal entity
		updateLegalEntity: {
			rest: {
				method: "PUT",
				path: "/updatelegalentity/:id",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const id = Number(ctx.params.id);
					const entityData = await prisma.nucleus_legal_entity_main.findUnique({
						where: {
							id: id,
						},
					});
					if (!entityData) throw new Error(`Record with ${ctx.params.id} does not exist`);
					delete ctx.params.id;
					const data = await prisma.nucleus_legal_entity_main.update({
						where: { id: id },
						data: ctx.params,
					});
					if (data.id)
						return {
							status: true,
							message: "Legal Entity updated succesfully",
						};
					else
						return new MoleculerClientError(
							"Failed to update legal entity",
							401,
							"UPDATE_LEGAL_ENTITY_ERROR",
						);
				} catch (error) {
					console.error("Error occured whiel updating legal entity:", error.message);
					throw new Error("Failed to update legal entity");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//Delete legal entity
		deleteLegalEntity: {
			rest: {
				method: "DELETE",
				path: "/deletelegalentity/:id",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const id = Number(ctx.params.id);
					const entityData = await prisma.nucleus_legal_entity_main.findUnique({
						where: {
							id: id,
						},
					});
					if (!entityData) throw new Error(`Record with ${id} does not exist`);
					const data = await prisma.nucleus_legal_entity_main.deleteMany({
						where: {
							id: id,
						},
					});
					if (data.count)
						return { status: true, message: "Legal Entity deleted successfully" };
					else
						return new MoleculerClientError(
							"Failed to delete legal entity",
							401,
							"Legal_Entity_ERROR",
						);
				} catch (err) {
					this.logger.error("Failed to delete legal entity");
					throw err;
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//create divisions
		createDivisions: {
			rest: {
				method: "POST",
				path: "/createdivisions",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const divisionData = ctx.params.data.map((dataValue: { [x: string]: Date }) => {
						dataValue["created_date"] = new Date();
						dataValue["modified_date"] = new Date();
						dataValue["modified_by"] = ctx.meta.user.id;
						dataValue["created_by"] = ctx.meta.user.id;
						return dataValue;
					});
					const createDivisions = await prisma.nucleus_division_main.createMany({
						data: divisionData,
						skipDuplicates: true,
					});
					if (createDivisions.count)
						return { status: true, message: "Divisons created successfully" };
					else {
						return new MoleculerClientError(
							"Failed to create division",
							401,
							"CREATE_DIVISION_ERROR",
						);
					}
				} catch (err) {
					this.logger.error("Error occured while creating divisons");
					throw err;
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//Rename/Drag divisions
		updateDivisions: {
			rest: {
				method: "PUT",
				path: "/updatedivisions/:id",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const id = Number(ctx.params.id);
					const divisionData = await prisma.nucleus_division_main.findUnique({
						where: {
							id: id,
						},
					});
					if (!divisionData)
						throw new Error(`Record with ${ctx.params.id} does not exist`);
					delete ctx.params.id;
					const data1 = await prisma.nucleus_division_main.update({
						where: { id: id },
						data: ctx.params,
					});
					if (data1.id) return { status: true, message: "Divisions updated succesfully" };
					else
						return new MoleculerClientError(
							"Failed to update divisions",
							401,
							"UPDATE_DIVISION_ERROR",
						);
				} catch (error) {
					console.error("Error occured whiel updating division:", error.message);
					throw new Error("Failed to update division");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//Delete divisions
		deleteDivisions: {
			rest: {
				method: "DELETE",
				path: "/deletedivisions/:id",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const id = Number(ctx.params.id);
					const entityData = await prisma.nucleus_division_main.findUnique({
						where: {
							id: id,
						},
					});
					if (!entityData) throw new Error(`Record with ${id} does not exist`);
					const data = await prisma.nucleus_division_main.deleteMany({
						where: {
							id: id,
						},
					});
					if (data.count)
						return { status: true, message: "Divisons deleted successfully" };
					else
						return new MoleculerClientError(
							"Failed to delete division",
							401,
							"DELETE_DIVISION_ERROR",
						);
				} catch (err) {
					this.logger.error("Failed to delete divisions");
					throw err;
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		// GET Maindepartment
		getDepartments: {
			rest: {
				method: "GET",
				path: "/getdepartments",
			},
			restricted: ["api"],
			async handler() {
				try {
					const response = await prisma.nucleus_department_main.findMany();
					return {
						status: true,
						data: response,
						message: `Fetched Department details successfully`,
					};
				} catch (error) {
					console.error("Error fetching maindepartment:", error);
					throw new Error("Failed to fetch Department");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		// POST createMainDepartment

		createDepartments: {
			rest: {
				method: "POST",
				path: "/createdepartments",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const departmentData = ctx.params.data.map(
						(dataValue: { [x: string]: Date }) => {
							dataValue["created_date"] = new Date();
							dataValue["modified_date"] = new Date();
							dataValue["modified_by"] = ctx.meta.user.id;
							dataValue["created_by"] = ctx.meta.user.id;
							return dataValue;
						},
					);
					const createDepartments = await prisma.nucleus_department_main.createMany({
						data: departmentData,
						skipDuplicates: true,
					});
					if (createDepartments.count)
						return { status: true, message: "Departments created successfully" };
					else {
						return new MoleculerClientError(
							"Failed to create departments",
							401,
							"CREATE_DEPARTMENTS_ERROR",
						);
					}
				} catch (err) {
					this.logger.error("Error occured while creating departments");
					throw err;
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//Rename/Drag departments
		updateDepartments: {
			rest: {
				method: "PUT",
				path: "/updatedepartments/:id",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const id = Number(ctx.params.id);
					const departmentData = await prisma.nucleus_department_main.findUnique({
						where: {
							id: id,
						},
					});
					if (!departmentData)
						throw new Error(`Record with ${ctx.params.id} does not exist`);
					delete ctx.params.id;
					const data1 = await prisma.nucleus_department_main.update({
						where: { id: id },
						data: ctx.params,
					});
					if (data1.id)
						return { status: true, message: "Departments updated succesfully" };
					else
						return new MoleculerClientError(
							"Failed to update departments",
							401,
							"UPDATE_DEPARTMENT_ERROR",
						);
				} catch (error) {
					console.error("Error occured whiel updating departments", error.message);
					throw new Error("Failed to update departments");
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//Delete departments
		deleteDepartments: {
			rest: {
				method: "DELETE",
				path: "/deletedepartments/:id",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const id = Number(ctx.params.id);
					const departmentData = await prisma.nucleus_department_main.findUnique({
						where: {
							id: id,
						},
					});
					if (!departmentData) throw new Error(`Record with ${id} does not exist`);
					const data = await prisma.nucleus_department_main.deleteMany({
						where: {
							id: id,
						},
					});
					if (data.count)
						return { status: true, message: "Departments deleted successfully" };
					else
						return new MoleculerClientError(
							"Failed to delete departments",
							401,
							"DELETE_DEPARTMENTS_ERROR",
						);
				} catch (err) {
					this.logger.error("Failed to delete departments");
					throw err;
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//Get Hierarchy data
		getHierarchyData: {
			rest: {
				method: "GET",
				path: "/hierarchydata",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const data = await prisma.nucleus_organization_main.findMany({
						select: {
							id: true,
							organization_name: true,
							nucleus_legal_entity_main: {
								select: {
									id: true,
									org_id: true,
									name: true,
									nucleus_business_unit_main: {
										select: {
											id: true,
											legal_entity_id: true,
											name: true,
											nucleus_division_main: {
												select: {
													id: true,
													name: true,
													business_unit_id: true,
													nucleus_department_main: {
														select: {
															id: true,
															name: true,
															division_id: true,
														},
													},
												},
											},
										},
									},
								},
							},
						},
					});

					if (data.length) return { status: true, data: data };
				} catch (err) {
					this.logger.error("Failed to get hierarchy data");
					throw err;
				} finally {
					await prisma.$disconnect();
				}
			},
		},
	},
};

export default OrganizationService;
