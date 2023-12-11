export interface User {
	id: number;
	user_code: string;
	first_name: string;
	last_name: string;
	date_of_birth: Date;
	date_of_joining: Date;
	employee_id: string;
	salutation: string;
	primary_email_address: string;
	primary_contact_number: string;
	password: string;
	reporting_manager_id: string;
	position: string;
	invite_user: string;
	role: string;
	address: string;
}

export interface OnBoardUser {
	is_onboarding: boolean;
	id: number;
	date_of_joining: Date;
	user_code: any;
	employee_code: string;
	first_name: string;
	last_name: string;
	primary_email_address: string;
	primary_contact_number: string;
	role: string;
	shift_id: number;
	employee_status: string;
	created_date: Date;
	modified_date: Date;
	created_by: number;
	modified_by: number;
	invite_user: string;
	meta: object;
}
