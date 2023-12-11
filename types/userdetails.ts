export interface EducationalDetails {
	institute_school: string;
	degree: string;
	major_department: string;
	duration_start: string;
	duration_end: string;
	grade_percentage: string;
	currently_pursuing: string;
}

export interface WorkExperienceDetails {
	company?: string;
	occupation_title?: string;
	work_duration_start?: Date;
	work_duration_end?: Date;
	summary: string;
	location: string;
	currently_working?: boolean;
	is_active?: boolean;
}
