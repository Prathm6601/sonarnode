export interface JobPosting {
	posting_title: string;
	department_id: number;
	number_of_positions: number;
	job_type_id: number;
	work_experience_id: number;
	date_opened: string;
	target_date: string;
	priority: string;
	first_level_approval: string;
	first_level_approver: number;
}
