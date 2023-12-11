import type { Service, ServiceSchema, Context } from "moleculer";
import { PrismaClient } from "@prisma/client";
import { Errors } from "moleculer";

const { MoleculerClientError } = Errors;

interface AttendanceSettings {
	defaultName: string;
}
export interface AttendanceEntity {
	org_image: string;
}

export type AttendanceCreateParams = Partial<AttendanceEntity>;
interface OrganizationMethods {
	uppercase(str: string): string;
}

interface AttendanceLocalVars {
	myVar: string;
}

type organizationThis = Service<AttendanceSettings> & OrganizationMethods & AttendanceLocalVars;
// Create an instance of the Prisma client
const prisma = new PrismaClient();

const AttendanceService: ServiceSchema<AttendanceSettings> = {
	name: "attendance",

	settings: {
		defaultName: "Moleculer",
	},
	hooks: {
		before: {},
	},
	actions: {
		// GET getAttendance detail
		getAttendanceForReportees: {
			rest: {
				method: "GET",
				path: "/attendanceforreportees",
			},
			restricted: ["api"],

			async handler(ctx) {
				try {
					const { reporting_manager_id } = ctx.params;
					const reportees = await prisma.nucleus_employee_main.findMany({
						where: {
							reporting_manager_id: reporting_manager_id,
						},
						select: {
							id: true,
							first_name: true,
							last_name: true,
						},
					});
					return {
						status: true,
						data: reportees,
					};
				} catch (error) {
					console.error("Error fetching attendance:", error);
					throw new Error("Failed to fetch attendance");
				}
			},
		},

		getWeeklyCallenderView: {
			rest: {
				method: "GET",
				path: "/getcallenderview",
			},

			async handler(ctx) {
				try {
					const { employee_id, startDate, endDate } = ctx.params;

					const attendanceDetails = await prisma.nucleus_attendance_main.findMany({
						where: {
							employee_id: parseInt(employee_id),
							check_in: {
								gte: new Date(startDate),
								lt: new Date(endDate),
							},
						},
						select: {
							date: true,
							check_in: true,
							check_out: true,
							total_hours: true,
							attendance_status: true,
							attendance_medium: true,
							multiple_in_out: true,
							shift_by_id: {
								select: {
									id: true,
									from: true,
									to: true,
								},
							},
						},
						orderBy: {
							date: "asc",
							// check_in: 'asc',
						},
					});

					if (attendanceDetails.length === 0) {
						return {
							status: true,
							message: "No attendance records found for the employee",
						};
					}

					const totalWeekHours = attendanceDetails.reduce((acc: number, record: any) => {
						if (record.total_hours) {
							const [hours, minutes, seconds] = record.total_hours
								.split(":")
								.map(Number);
							acc += hours * 3600 + minutes * 60 + seconds;
						}
						return acc;
					}, 0);
					const formatTime = (time: any) => {
						const hours = time.getHours().toString().padStart(2, "0");
						const minutes = time.getMinutes().toString().padStart(2, "0");
						const seconds = time.getSeconds().toString().padStart(2, "0");
						return `${hours}:${minutes}:${seconds}`;
					};
					const checkInTimes = attendanceDetails.map((record: any) =>
						new Date(record.check_in).getTime(),
					);
					const checkOutTimes = attendanceDetails.map((record: any) =>
						new Date(record.check_out).getTime(),
					);

					const averageCheckInTime = new Date(
						Math.floor(
							checkInTimes.reduce((acc: any, time: any) => acc + time, 0) /
								checkInTimes.length,
						),
					);
					const averageCheckOutTime = new Date(
						Math.floor(
							checkOutTimes.reduce((acc: any, time: any) => acc + time, 0) /
								checkOutTimes.length,
						),
					);
					const uniqueDates = new Set(
						attendanceDetails.map((record: any) => record.date?.toISOString()),
					);
					const totalAttendanceDays = uniqueDates.size;

					const status = {
						payable_days: 5,
						present: 5,
						on_duty: 5,
						paid_leaves: 4,
						weekend: 1,
						statutory: 4,
						non_statutory: 2,
						absent: 0,
						unpaid: 0,
					};

					const response = {
						status,
						total_attendance_days: totalAttendanceDays,
						total_week_hours: `${Math.floor(totalWeekHours / 3600)}:${Math.floor(
							(totalWeekHours % 3600) / 60,
						)}:${totalWeekHours % 60}`,
						average_check_in_time: formatTime(averageCheckInTime),
						average_check_out_time: formatTime(averageCheckOutTime),
						attendance_details: (() => {
							const detailsByDate: { [dateKey: string]: any[] } = {};

							attendanceDetails.forEach((record: any) => {
								const dateKey = record.date?.toISOString();

								if (dateKey) {
									if (!detailsByDate[dateKey]) {
										detailsByDate[dateKey] = [];
									}

									detailsByDate[dateKey].push({
										date: dateKey,
										check_in: record.check_in,
										check_out: record.check_out,
										attendance_status: record.attendance_status,
										total_hours: record.total_hours,
										shift_id: record.shift_by_id.id,
										shift_start_time: record.shift_by_id.from,
										shift_end_time: record.shift_by_id.to,
										multiple_in_out: record.multiple_in_out,
									});
								}
							});

							return Object.entries(detailsByDate).map(
								([date, attendanceRecords]) => attendanceRecords,
							);
						})(),
					};

					return {
						status: true,
						data: response,
					};
				} catch (error) {
					console.error("Error fetching callender view:", error);
					throw new Error("Failed to fetch callender view");
				}
			},
		},
		//Post Regularization
		createRegularization: {
			rest: {
				method: "POST",
				path: "/createregularization",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const createRegularization =
						await prisma.nucleus_attendance_regularization.create({
							data: {
								attendance_id: ctx.params.attendance_id,
								date: new Date(ctx.params.date),
								regularized_check_in: new Date(),
								regularized_check_out: new Date(),
								regularized_total_hours: ctx.params.regularized_total_hours,
								reason: ctx.params.reason,
								description: ctx.params.description,
								approved_by: ctx.params.approved_by,
							},
						});

					if (createRegularization) {
						return {
							createRegularization,
							status: true,
							message: "Regularization created successfully",
						};
					} else {
						return new MoleculerClientError(
							"Failed to create regularization",
							401,
							"CREATE_REGULARIZATION_ERROR",
						);
					}
				} catch (err) {
					this.logger.error("Error occurred while creating regularization", err);
					throw err;
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		getCheckinCheckout: {
			rest: {
				method: "GET",
				path: "/getcheckincheckout",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const { employeeId, date } = ctx.params;

					//Query to fetch First Check-In data
					const checkInDetails = await prisma.nucleus_attendance_main.findFirst({
						where: {
							employee_id: employeeId,
							date: new Date(date),
						},
						orderBy: [{ check_in: "asc" }],
						select: {
							check_in: true,
						},
					});

					//Query to fetch Last Check-Out data
					const checkOutDetails = await prisma.nucleus_attendance_main.findFirst({
						where: {
							employee_id: employeeId,
							date: new Date(date),
						},
						orderBy: [{ check_out: "desc" }],
						select: {
							check_out: true,
						},
					});

					if (checkInDetails || checkOutDetails) {
						return {
							status: true,
							message: "Earliest Check-In Check-Out details fetched successfully",
							data: {
								checkIn: checkInDetails ? checkInDetails.check_in : null,
								checkOut: checkOutDetails ? checkOutDetails.check_out : null,
							},
						};
					} else {
						return {
							status: false,
							message:
								"Check-In Check-Out details not found for the specified employee and date",
						};
					}
				} catch (err) {
					// Handle errors
					console.error("Error occurred while fetching Check-In Check-Out details", err);
					throw err;
				} finally {
					// Disconnect Prisma client
					await prisma.$disconnect();
				}
			},
		},

		getRegularization: {
			rest: {
				method: "GET",
				path: "/regularization",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					let query = {};

					if (ctx.params.limit || ctx.params.offset)
						query = {
							skip: Number(ctx.params.offset) ?? 0,
							take: Number(ctx.params.limit) ?? 10,
							where: {
								attendance: {
									employee_id: ctx.params.employee_id,
								},
							},
							include: {
								attendance: {
									include: {
										employee: {
											select: {
												employee_code: true,
												first_name: true,
												last_name: true,
											},
										},
									},
								},
							},
						};
					const [data, count] = await prisma.$transaction([
						prisma.nucleus_attendance_regularization.findMany(query),
						prisma.nucleus_attendance_regularization.count(),
					]);

					return {
						status: true,
						pagination: {
							total: count,
						},
						data: data,
					};
				} catch (err) {
					this.logger.error(`Error occured while fetching regularization data`);
					throw err;
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		updateRegularization: {
			rest: {
				method: "PUT",
				path: "/updateregularization/:id",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const id = Number(ctx.params.id);
					const data = await prisma.nucleus_attendance_regularization.findFirst({
						where: { id: id },
					});
					if (!data)
						return new MoleculerClientError(
							`Record with ${id} does not exist`,
							401,
							"INVALID_REQUEST_ERROR",
						);
					delete ctx.params.id;
					const updateResult = await prisma.nucleus_attendance_regularization.update({
						where: {
							id: id,
						},
						data: {
							...ctx.params,
							modified_date: new Date(),
							modified_by: ctx.meta.user.id,
						},
					});
					if (updateResult.id)
						return {
							status: true,
							message: "Regularization approved succesfully",
						};
					else
						return new MoleculerClientError(
							"Failed to approve regularization by manager",
							401,
							"APPROVAL_REGULARIZATION_ERROR",
						);
				} catch (err) {
					this.logger.error(`Error occured while approving regularization by manager`);
					throw err;
				} finally {
					await prisma.$disconnect();
				}
			},
		},
		getRegularizationDetail: {
			rest: {
				method: "GET",
				path: "/regularization/:id",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const id = Number(ctx.params.id);
					const data = await prisma.nucleus_attendance_regularization.findFirst({
						where: { id: id },
					});
					if (!data)
						return new MoleculerClientError(
							`Record with ${id} does not exist`,
							401,
							"INVALID_REQUEST_ERROR",
						);
					const regularizationData =
						await prisma.nucleus_attendance_regularization.findFirst({
							where: {
								id: id,
							},
							include: {
								attendance: {
									select: {
										date: true,
										check_in: true,
										check_out: true,
										attendance_medium: true,
										attendance_status: true,
										shift_by_id: {
											select: {
												name: true,
												from: true,
												to: true,
											},
										},
										employee: {
											select: {
												employee_code: true,
												first_name: true,
												last_name: true,
											},
										},
									},
								},
							},
						});

					if (regularizationData?.id)
						return {
							status: true,
							data: regularizationData,
						};
					else
						return new MoleculerClientError(
							`Failed to fetch regularization detail`,
							401,
							"REGULARIZATION_DATA_FETCH_ERROR",
						);
				} catch (err) {
					this.logger.error(`Error occured while fetching regularization detail`);
					throw err;
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//Delete Regularization
		deleteRegularization: {
			rest: {
				method: "DELETE",
				path: "/deleteregularization/:id",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const regularizationId = parseInt(ctx.params.id);

					// Check if the record exists before attempting to delete
					const existingRecord =
						await prisma.nucleus_attendance_regularization.findUnique({
							where: {
								id: regularizationId,
							},
						});

					if (!existingRecord) {
						return new MoleculerClientError(
							"Record not found",
							404,
							"RECORD_NOT_FOUND_ERROR",
						);
					}

					if (existingRecord.approval_status === "approved") {
						return {
							status: false,
							message:
								"Your request is approved. You cannot delete the regularization.",
						};
					}

					if (existingRecord.is_deleted) {
						return {
							status: false,
							message: "Regularization record is already deleted.",
						};
					}

					//Soft delete: update the is_deleted field true
					await prisma.nucleus_attendance_regularization.update({
						where: {
							id: regularizationId,
						},
						data: {
							is_deleted: true,
						},
					});

					return {
						status: true,
						message: "Regularization record deleted successfully",
					};
				} catch (err) {
					this.logger.error("Error occurred while deleting regularization", err);
					throw err;
				} finally {
					await prisma.$disconnect();
				}
			},
		},

		//Update regularization details
		updateRegularizationDetails: {
			rest: {
				method: "PUT",
				path: "/updateregularizationdetails/:id",
			},
			restricted: ["api"],
			async handler(ctx) {
				try {
					const regularizationId = parseInt(ctx.params.id, 10);

					const existingRegularization =
						await prisma.nucleus_attendance_regularization.findUnique({
							where: {
								id: regularizationId,
							},
						});

					if (!existingRegularization) {
						return new MoleculerClientError(
							`record with id ${regularizationId} does not exist`,
							404,
							"ID_NOT_FOUND_ERROR",
						);
					}
					const { id: _, ...dataWithoutId } = ctx.params;

					const updateRegularization =
						await prisma.nucleus_attendance_regularization.update({
							where: {
								id: regularizationId,
							},
							data: {
								...dataWithoutId,
							},
						});

					if (updateRegularization) {
						return {
							updateRegularization,
							status: true,
							message: "Regularization updated successfully",
						};
					} else {
						return new MoleculerClientError(
							"Failed to update regularization",
							401,
							"UPDATE_REGULARIZATION_ERROR",
						);
					}
				} catch (err) {
					this.logger.error("Error occurred while updating regularization", err);
					throw err;
				} finally {
					await prisma.$disconnect();
				}
			},
		},
	},
	methods: {},
};

export default AttendanceService;
