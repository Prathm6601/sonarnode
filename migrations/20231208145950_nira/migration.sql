-- CreateTable
CREATE TABLE "nucleus_user_main" (
    "id" SERIAL NOT NULL,
    "user_code" VARCHAR(10),
    "salutation" VARCHAR(10),
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "date_of_birth" DATE,
    "date_of_joining" DATE,
    "primary_email_address" VARCHAR(50),
    "secondary_email_address" VARCHAR(50),
    "primary_contact_number" VARCHAR(20),
    "secondary_contact_number" VARCHAR(20),
    "password" VARCHAR(256),
    "reporting_manager_id" VARCHAR(50),
    "offer_designation_id" INTEGER,
    "user_status" INTEGER,
    "role" VARCHAR(50),
    "address" VARCHAR(256),
    "state" VARCHAR(30),
    "country" VARCHAR(30),
    "city" VARCHAR(30),
    "postalcode" VARCHAR(30),
    "highest_qualification_id" INTEGER,
    "current_job_title" VARCHAR(30),
    "current_salary" VARCHAR(30),
    "skillset" VARCHAR(256),
    "relevant_experience" VARCHAR(40),
    "current_employer" VARCHAR(50),
    "notice_period" VARCHAR(40),
    "expected_salary" VARCHAR(50),
    "recruiter" INTEGER,
    "profile_source_id" INTEGER,
    "job_type_id" INTEGER,
    "resume" TEXT,
    "cover_letter" TEXT,
    "others" TEXT,
    "contracts" TEXT,
    "offer" TEXT,
    "current_location" VARCHAR(20),
    "relocation" BOOLEAN,
    "posting_title_id" INTEGER,
    "ratings" INTEGER,
    "overall_comments" TEXT,
    "gender" VARCHAR(20),
    "marital_status" VARCHAR(20),
    "emergency_contact_number" VARCHAR(30),
    "blood_group" VARCHAR(20),
    "profile_image" VARCHAR(256),
    "total_experience" VARCHAR(30),
    "permanent_address" VARCHAR(256),
    "date_of_contract" DATE,
    "user_exit_status" VARCHAR(50),
    "date_of_confirmation" DATE,
    "contract_end_date" DATE,
    "invalid_attempt" BOOLEAN,
    "lock_time" BOOLEAN,
    "password_history" VARCHAR(256),
    "background_chk_status" VARCHAR(30),
    "candidate_referred_by" VARCHAR(30),
    "company_id" VARCHAR(30),
    "is_onboarding" BOOLEAN,
    "invite_user" VARCHAR(50),
    "is_active" BOOLEAN,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_user_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_organization_main" (
    "id" INTEGER NOT NULL,
    "organization_name" VARCHAR(255) NOT NULL,
    "org_image" VARCHAR(255) NOT NULL,
    "domain" VARCHAR(255),
    "website" VARCHAR(255) NOT NULL,
    "total_employees" VARCHAR(150) NOT NULL,
    "registration_number" VARCHAR(255) NOT NULL,
    "org_start_date" TIMESTAMP(6) NOT NULL,
    "phone_number" VARCHAR(255) NOT NULL,
    "secondary_phone" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "secondary_email" VARCHAR(255),
    "fax_number" VARCHAR(255),
    "country" VARCHAR(150) NOT NULL,
    "state" VARCHAR(150) NOT NULL,
    "city" VARCHAR(150) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "org_head" VARCHAR(255) NOT NULL,
    "designation" VARCHAR[],
    "user_license" INTEGER,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_organization_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_business_unit_main" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "legal_entity_id" INTEGER,
    "unit_code" VARCHAR(50),
    "description" VARCHAR(255),
    "is_active" BOOLEAN DEFAULT true,
    "is_deleted" BOOLEAN,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_business_unit_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_currency_main" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "symbol" VARCHAR(10),
    "exchange_rate" DECIMAL(10,4),
    "is_active" BOOLEAN NOT NULL,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "createddate" TIMESTAMP(6),
    "modifieddate" TIMESTAMP(6),

    CONSTRAINT "nucleus_currency_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_department_main" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "division_id" INTEGER,
    "dept_code" VARCHAR(20),
    "description" VARCHAR(255),
    "start_date" DATE,
    "dept_head" INTEGER,
    "is_active" BOOLEAN DEFAULT true,
    "is_deleted" BOOLEAN,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_department_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_employee_main" (
    "id" SERIAL NOT NULL,
    "employee_code" VARCHAR(20),
    "salutation" VARCHAR(10),
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "date_of_birth" DATE,
    "email_address" VARCHAR(50),
    "contact_number" VARCHAR(20),
    "password" VARCHAR(256),
    "reporting_manager_id" VARCHAR(50),
    "designation_id" INTEGER,
    "employee_type" VARCHAR(50),
    "employee_status" VARCHAR(50),
    "gender" VARCHAR(20),
    "marital_status" VARCHAR(20),
    "emergency_contact_number" VARCHAR(30),
    "relevant_experience" VARCHAR(50),
    "role_id" INTEGER,
    "profile_image" VARCHAR(256),
    "total_experience" VARCHAR(30),
    "primary_skill" VARCHAR(50),
    "secondary_skill" VARCHAR(50),
    "source_of_hire_id" VARCHAR(50),
    "seating_location" VARCHAR(30),
    "date_of_contract" DATE,
    "notice_period" VARCHAR(50),
    "team_name" VARCHAR(50),
    "date_of_confirmation" DATE,
    "client" VARCHAR(30),
    "probation_status" VARCHAR(30),
    "probation_extended_date" DATE,
    "probation_period" VARCHAR(10),
    "probation_due_date" DATE,
    "joining_day" VARCHAR(20),
    "joining_status" VARCHAR(20),
    "contract_end_date" DATE,
    "invalid_attempt" BOOLEAN,
    "lock_time" BOOLEAN,
    "password_history" VARCHAR(256),
    "employee_full_name" VARCHAR(50),
    "employee_ip_address" VARCHAR(50),
    "background_check_status" VARCHAR(30),
    "job_title_id" VARCHAR(30),
    "tour_flag" BOOLEAN,
    "mode_of_entry" VARCHAR(30),
    "entry_comments" VARCHAR(30),
    "candidate_referred_by" VARCHAR(30),
    "company_id" VARCHAR(30),
    "employee_temp_lock" VARCHAR(255),
    "employee_reason_locked" VARCHAR(255),
    "employee_locked_date" DATE,
    "google_id" VARCHAR(150),
    "shift_id" INTEGER NOT NULL,
    "date_of_joining" DATE,
    "date_of_leaving" DATE,
    "business_unit_id" INTEGER,
    "legal_entity_id" INTEGER,
    "division_id" INTEGER,
    "department_id" INTEGER,
    "extension_number" VARCHAR(20),
    "office_number" VARCHAR(100),
    "office_fax_number" VARCHAR(100),
    "is_mega_admin" BOOLEAN,
    "is_active" BOOLEAN,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_employee_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_employee_bank_details" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "bank_name" VARCHAR(50) NOT NULL,
    "branch_name" VARCHAR(50) NOT NULL,
    "bank_account" VARCHAR(50) NOT NULL,
    "bank_address" VARCHAR(256) NOT NULL,
    "ifsc_code" VARCHAR(50) NOT NULL,
    "account_holder_name" VARCHAR(50) NOT NULL,
    "uan_number" VARCHAR(50) NOT NULL,
    "nominee_name" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_employee_bank_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_employee_details" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "personal_email_address" VARCHAR(50),
    "permanent_address" VARCHAR(256) NOT NULL,
    "permanent_city" VARCHAR(30) NOT NULL,
    "permanent_state" VARBIT(30) NOT NULL,
    "permanent_country" VARCHAR(30) NOT NULL,
    "permanent_pincode" VARCHAR(30) NOT NULL,
    "current_address" VARCHAR(256),
    "current_city" VARCHAR(30) NOT NULL,
    "current_state" VARBIT(30) NOT NULL,
    "current_country" VARCHAR(30) NOT NULL,
    "current_pincode" VARCHAR(30) NOT NULL,
    "blood_group" VARCHAR(20),
    "work_location" VARCHAR(30) NOT NULL,
    "marriage_date" DATE NOT NULL,
    "place_of_birth" VARCHAR(30) NOT NULL,
    "aadharcard" VARCHAR(30) NOT NULL,
    "pancard" VARCHAR(30) NOT NULL,
    "religion" VARCHAR(10) NOT NULL,
    "nationality" VARCHAR(30) NOT NULL,
    "language" VARCHAR(30) NOT NULL,
    "previous_company" VARCHAR(30) NOT NULL,
    "international_employee" VARCHAR(10) NOT NULL,
    "physically_challenged" VARCHAR(10) NOT NULL,
    "about_me" TEXT NOT NULL,
    "passport_number" VARCHAR(30) NOT NULL,
    "age" VARCHAR(10) NOT NULL,
    "bench_status" VARCHAR(30) NOT NULL,
    "current_permenent_address_same" BOOLEAN NOT NULL,
    "is_active" BOOLEAN,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_employee_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_employee_family_details" (
    "id" SERIAL NOT NULL,
    "employee_details_id" INTEGER,
    "father_name" VARCHAR(30),
    "mother_name" VARBIT(30),
    "age" INTEGER,
    "relation" VARCHAR(30),
    "spouse" VARCHAR(30),
    "is_active" BOOLEAN,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_employee_family_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_holiday_main" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "holiday" DATE NOT NULL,
    "is_deleted" BOOLEAN,
    "is_optional" BOOLEAN,
    "from" VARCHAR(20),
    "to" VARCHAR(20),
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER NOT NULL,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_holiday_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_module_main" (
    "id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "module_name" VARCHAR(256) NOT NULL,
    "module_desc" VARCHAR(256),
    "is_active" BOOLEAN,
    "is_enabled" BOOLEAN,
    "is_ai_enabled" BOOLEAN,
    "module_title" VARCHAR(50),
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_module_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_role_main" (
    "id" SERIAL NOT NULL,
    "role_name" VARCHAR(256) NOT NULL,
    "level_id" INTEGER NOT NULL,
    "role_desc" VARCHAR(256) NOT NULL,
    "is_read_allowed" BOOLEAN NOT NULL,
    "is_write_allowed" BOOLEAN NOT NULL,
    "is_update_allowed" BOOLEAN NOT NULL,
    "is_delete_allowed" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER NOT NULL,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_role_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_role_level" (
    "id" SERIAL NOT NULL,
    "level_name" VARCHAR(50) NOT NULL,
    "level_desc" VARCHAR NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER NOT NULL,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_role_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_shift_main" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "from" VARCHAR(50),
    "to" VARCHAR(50),
    "reason" VARCHAR(256),
    "is_deleted" BOOLEAN,
    "financial_year" VARCHAR(20),
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "createddate" TIMESTAMP(6),
    "modifieddate" TIMESTAMP(6),

    CONSTRAINT "nucleus_shift_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_sitepreference_main" (
    "id" INTEGER NOT NULL,
    "emp_code" VARCHAR(255) NOT NULL,
    "date_format_id" VARCHAR(255) NOT NULL,
    "time_format_id" VARCHAR(255) NOT NULL,
    "time_zone_id" VARCHAR(255) NOT NULL,
    "currency_id" VARCHAR(255) NOT NULL,
    "password_id" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "font_type" VARCHAR(255) NOT NULL,
    "font_size" VARCHAR(255) NOT NULL,
    "colour_primary" VARCHAR(255) NOT NULL,
    "colour_secondary" VARCHAR(255) NOT NULL,
    "colour_tertiary" VARCHAR(255) NOT NULL,
    "login_image" VARCHAR(255),
    "login_message" VARCHAR(255),
    "is_active" BOOLEAN,
    "org_modules" JSON,
    "employment_status" VARCHAR[],
    "country" VARCHAR(255),
    "state" VARCHAR(255),
    "city" VARCHAR(255),
    "org_id" INTEGER NOT NULL,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_sitepreference_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Temp_employee" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER,
    "otp" INTEGER,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "email_address" VARCHAR(100) NOT NULL,
    "contact_number" VARCHAR(25) NOT NULL,
    "expired_at" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "temp_users_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_attendance_main" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "date" DATE,
    "check_in" TIMESTAMP(6),
    "check_out" TIMESTAMP(6),
    "total_hours" VARCHAR(20),
    "shift_id" INTEGER,
    "attendance_medium" VARCHAR,
    "attendance_status" VARCHAR(20),
    "attendance_setting_id" INTEGER,
    "multiple_in_out" JSON,
    "is_active" BOOLEAN,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_attendance_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_attendance_regularization" (
    "id" SERIAL NOT NULL,
    "attendance_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "regularized_check_in" TIMESTAMP(6) NOT NULL,
    "regularized_check_out" TIMESTAMP(6) NOT NULL,
    "regularized_total_hours" VARCHAR(20) NOT NULL,
    "approval_status" VARCHAR(20),
    "reason" TEXT NOT NULL,
    "description" VARCHAR NOT NULL,
    "approved_by" INTEGER NOT NULL,
    "is_deleted" BOOLEAN,
    "is_active" BOOLEAN,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_attendance_regularization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_attendance_setting" (
    "id" SERIAL NOT NULL,
    "total_hours_calculation" VARCHAR,
    "minimum_hours_full_day" VARCHAR,
    "minimum_hours_half_day" VARCHAR,
    "show_over_time" BOOLEAN,
    "include_weekend" BOOLEAN,
    "include_holidays" BOOLEAN,
    "include_leave" BOOLEAN,
    "is_active" BOOLEAN,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_attendance_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blacklist" (
    "id" SERIAL NOT NULL,
    "token" VARCHAR(250) NOT NULL,
    "is_active" BOOLEAN,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "blacklist_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_legal_entity_main" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "legal_entity_code" VARCHAR(20),
    "description" VARCHAR(255),
    "is_active" BOOLEAN DEFAULT true,
    "is_deleted" BOOLEAN,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_legal_entity_main_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_division_main" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "description" VARCHAR(256),
    "business_unit_id" INTEGER,
    "is_deleted" BOOLEAN,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_division_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" SERIAL NOT NULL
);

-- CreateTable
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON,
    "expire" TIMESTAMP(6),
    "token" VARCHAR(256),

    CONSTRAINT "session_pk" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "nova_manpower_requisition_main" (
    "id" SERIAL NOT NULL,
    "posting_title" VARCHAR(256) NOT NULL,
    "department_id" INTEGER NOT NULL,
    "team_id" INTEGER,
    "number_of_positions" VARCHAR(10) NOT NULL,
    "job_type_id" INTEGER NOT NULL,
    "qualification_required_desired" VARCHAR(256),
    "work_experience_id" INTEGER NOT NULL,
    "reason_for_requirement" VARCHAR(256),
    "job_opening_status" VARCHAR(50),
    "date_opened" DATE NOT NULL,
    "target_date" DATE NOT NULL,
    "hiring_manager" INTEGER,
    "assigned_recruiter" INTEGER,
    "priority" VARCHAR(30) NOT NULL,
    "industry_id" INTEGER,
    "skill_set_id" INTEGER,
    "secondary_skill_set" VARCHAR(256),
    "budget" VARCHAR(256),
    "city" VARCHAR(30),
    "country" VARCHAR(30),
    "state" VARCHAR(30),
    "postal_code" VARCHAR(30),
    "remote_job" BOOLEAN,
    "job_description" TEXT,
    "salary_id" INTEGER,
    "first_level_approval" VARCHAR(30) NOT NULL,
    "second_level_approval" VARCHAR(30),
    "third_level_approval" VARCHAR(30),
    "first_level_approver" INTEGER NOT NULL,
    "second_level_approver" INTEGER,
    "third_level_approver" INTEGER,
    "job_summary" TEXT,
    "other" TEXT,
    "date_closed" DATE,
    "publish" VARCHAR(50),
    "associated_tag" VARCHAR(50),
    "last_activity_time" TIMESTAMP(6),
    "client" TEXT,
    "number_of_associated_candidates" INTEGER,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nova_manpower_requisition_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nova_interview_main" (
    "id" SERIAL NOT NULL,
    "manpower_requisition_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "type" VARCHAR(50),
    "round" VARCHAR(50),
    "location" TEXT NOT NULL,
    "reminder_id" INTEGER NOT NULL,
    "from" TIME NOT NULL,
    "to" TIME NOT NULL,
    "assessment" VARCHAR(50),
    "schedule_comments" TEXT,
    "cancellation_reason" TEXT,
    "cancellation_comments" TEXT,
    "is_deleted" BOOLEAN,
    "attachments" TEXT,
    "reviewed_by" INTEGER NOT NULL,
    "reviewed_time" TIMESTAMP(6),
    "review_comments" TEXT,
    "last_activity_time" TIMESTAMP(6),
    "interview_status" VARCHAR(50),
    "user_status_id" INTEGER NOT NULL,
    "zoom_event_id" VARCHAR(10),
    "interview_link" TEXT,
    "google_meeting_id" BOOLEAN,
    "assigned_recruiter" INTEGER NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER NOT NULL,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nova_interview_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_user_status" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256),
    "category" VARCHAR(256),
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_user_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nova_designation_main" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "is_deleted" BOOLEAN,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nova_designation_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nova_industry_main" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "is_deleted" BOOLEAN,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nova_industry_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nova_job_type_main" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "is_deleted" BOOLEAN,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nova_job_type_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nova_profile_source_main" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "is_deleted" BOOLEAN,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nova_profile_source_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nova_highest_qualification_main" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "is_deleted" BOOLEAN,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nova_highest_qualification_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nova_reminder_main" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "is_deleted" BOOLEAN,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nova_reminder_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nova_salary_range_main" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "is_deleted" BOOLEAN,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nova_salary_range_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nova_skillset_main" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "is_deleted" BOOLEAN,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nova_skillset_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nova_team_main" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "is_deleted" BOOLEAN,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nova_team_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nova_work_experience_main" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "is_deleted" BOOLEAN,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nova_work_experience_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_user_educational_details_main" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "institute_school" TEXT,
    "degree" TEXT,
    "major_department" TEXT,
    "duration_start" DATE,
    "duration_end" DATE,
    "grade_percentage" VARCHAR(20),
    "currently_pursuing" BOOLEAN,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_user_educational_details_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_user_experience_details_main" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "company" TEXT,
    "occupation_title" TEXT,
    "work_duration_start" DATE,
    "work_duration_end" DATE,
    "summary" TEXT,
    "location" VARCHAR(50) NOT NULL,
    "currently_working" BOOLEAN,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_user_experience_details_main_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nucleus_user_rating_history" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER,
    "overall_comments" TEXT,
    "posting_title_id" INTEGER,
    "candidate_id" INTEGER,
    "interview_id" INTEGER,
    "reviewed_on" TIMESTAMP(6),
    "interview_status" VARCHAR(100),
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nucleus_user_rating_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nova_timeline_main" (
    "id" SERIAL NOT NULL,
    "manpower_requisition_id" INTEGER,
    "candidate_id" INTEGER,
    "interview_id" INTEGER,
    "section" VARCHAR(100),
    "previous_status" VARCHAR(100),
    "current_status" VARCHAR(100),
    "interview_name" VARCHAR(100),
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_date" TIMESTAMP(6),
    "modified_date" TIMESTAMP(6),

    CONSTRAINT "nova_timeline_main_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nucleus_business_unit_main_un" ON "nucleus_business_unit_main"("name");

-- CreateIndex
CREATE UNIQUE INDEX "nucleus_department_main_name_key" ON "nucleus_department_main"("name");

-- CreateIndex
CREATE UNIQUE INDEX "nucleus_holiday_main_created_by_key" ON "nucleus_holiday_main"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "nucleus_holiday_main_modified_by_key" ON "nucleus_holiday_main"("modified_by");

-- CreateIndex
CREATE UNIQUE INDEX "nucleus_legal_entity_main_name_key" ON "nucleus_legal_entity_main"("name");

-- CreateIndex
CREATE UNIQUE INDEX "nucleus_division_main_name_key" ON "nucleus_division_main"("name");

-- CreateIndex
CREATE UNIQUE INDEX "nova_manpower_requisition_main_posting_title_key" ON "nova_manpower_requisition_main"("posting_title");

-- AddForeignKey
ALTER TABLE "nucleus_user_main" ADD CONSTRAINT "nucleus_user_main_offer_designation_id_fkey" FOREIGN KEY ("offer_designation_id") REFERENCES "nova_designation_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_user_main" ADD CONSTRAINT "nucleus_user_main_job_type_id_fkey" FOREIGN KEY ("job_type_id") REFERENCES "nova_job_type_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_user_main" ADD CONSTRAINT "nucleus_user_main_user_status_fkey" FOREIGN KEY ("user_status") REFERENCES "nucleus_user_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_user_main" ADD CONSTRAINT "nucleus_user_main_posting_title_id_fkey" FOREIGN KEY ("posting_title_id") REFERENCES "nova_manpower_requisition_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_user_main" ADD CONSTRAINT "nucleus_user_main_profile_source_id_fkey" FOREIGN KEY ("profile_source_id") REFERENCES "nova_profile_source_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_user_main" ADD CONSTRAINT "nucleus_user_main_highest_qualification_id_fkey" FOREIGN KEY ("highest_qualification_id") REFERENCES "nova_highest_qualification_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_user_main" ADD CONSTRAINT "nucleus_user_main_recruiter_fkey" FOREIGN KEY ("recruiter") REFERENCES "nucleus_employee_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_user_main" ADD CONSTRAINT "nucleus_user_main_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "nucleus_employee_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_user_main" ADD CONSTRAINT "nucleus_user_main_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "nucleus_employee_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_business_unit_main" ADD CONSTRAINT "nucleus_business_unit_main_legal_entity_id_fkey" FOREIGN KEY ("legal_entity_id") REFERENCES "nucleus_legal_entity_main"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_department_main" ADD CONSTRAINT "nucleus_department_main_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "nucleus_division_main"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_employee_main" ADD CONSTRAINT "nucleus_employee_main_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "nucleus_shift_main"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_employee_main" ADD CONSTRAINT "nucleus_employee_main_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "nucleus_role_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_employee_main" ADD CONSTRAINT "nucleus_employee_main_designation_id_fkey" FOREIGN KEY ("designation_id") REFERENCES "nova_designation_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_employee_main" ADD CONSTRAINT "nucleus_employee_main_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "nucleus_department_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_employee_main" ADD CONSTRAINT "nucleus_employee_main_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "nucleus_division_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_employee_main" ADD CONSTRAINT "nucleus_employee_main_legal_entity_id_fkey" FOREIGN KEY ("legal_entity_id") REFERENCES "nucleus_legal_entity_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_module_main" ADD CONSTRAINT "nucleus_module_main_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "nucleus_organization_main"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_role_main" ADD CONSTRAINT "nucleus_role_main_fk" FOREIGN KEY ("level_id") REFERENCES "nucleus_role_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nucleus_sitepreference_main" ADD CONSTRAINT "nucleus_sitepreference_main_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "nucleus_organization_main"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_attendance_main" ADD CONSTRAINT "nucleus_attendance_main_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "nucleus_shift_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_attendance_main" ADD CONSTRAINT "nucleus_attendance_main_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "nucleus_employee_main"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_attendance_regularization" ADD CONSTRAINT "nucleus_attendance_regularization_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "nucleus_attendance_main"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_attendance_regularization" ADD CONSTRAINT "nucleus_attendance_regularization_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "nucleus_employee_main"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_legal_entity_main" ADD CONSTRAINT "nucleus_legal_entity_main_fk" FOREIGN KEY ("org_id") REFERENCES "nucleus_organization_main"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_legal_entity_main" ADD CONSTRAINT "nucleus_legal_entity_main_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "nucleus_employee_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_legal_entity_main" ADD CONSTRAINT "nucleus_legal_entity_main_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "nucleus_employee_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_division_main" ADD CONSTRAINT "nucleus_division_main_fk" FOREIGN KEY ("business_unit_id") REFERENCES "nucleus_business_unit_main"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_manpower_requisition_main" ADD CONSTRAINT "nova_manpower_requisition_main_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "nucleus_department_main"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_manpower_requisition_main" ADD CONSTRAINT "nova_manpower_requisition_main_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "nova_industry_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_manpower_requisition_main" ADD CONSTRAINT "nova_manpower_requisition_main_job_type_id_fkey" FOREIGN KEY ("job_type_id") REFERENCES "nova_job_type_main"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_manpower_requisition_main" ADD CONSTRAINT "nova_manpower_requisition_main_salary_id_fkey" FOREIGN KEY ("salary_id") REFERENCES "nova_salary_range_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_manpower_requisition_main" ADD CONSTRAINT "nova_manpower_requisition_main_skill_set_id_fkey" FOREIGN KEY ("skill_set_id") REFERENCES "nova_skillset_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_manpower_requisition_main" ADD CONSTRAINT "nova_manpower_requisition_main_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "nova_team_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_manpower_requisition_main" ADD CONSTRAINT "nova_manpower_requisition_main_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "nucleus_employee_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_manpower_requisition_main" ADD CONSTRAINT "nova_manpower_requisition_main_hiring_manager_fkey" FOREIGN KEY ("hiring_manager") REFERENCES "nucleus_employee_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_manpower_requisition_main" ADD CONSTRAINT "nova_manpower_requisition_main_assigned_recruiter_fkey" FOREIGN KEY ("assigned_recruiter") REFERENCES "nucleus_employee_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_manpower_requisition_main" ADD CONSTRAINT "nova_manpower_requisition_main_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "nucleus_employee_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_manpower_requisition_main" ADD CONSTRAINT "nova_manpower_requisition_main_first_level_approver_fkey" FOREIGN KEY ("first_level_approver") REFERENCES "nucleus_employee_main"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_manpower_requisition_main" ADD CONSTRAINT "nova_manpower_requisition_main_second_level_approver_fkey" FOREIGN KEY ("second_level_approver") REFERENCES "nucleus_employee_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_manpower_requisition_main" ADD CONSTRAINT "nova_manpower_requisition_main_third_level_approver_fkey" FOREIGN KEY ("third_level_approver") REFERENCES "nucleus_employee_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_manpower_requisition_main" ADD CONSTRAINT "nova_manpower_requisition_main_work_experience_id_fkey" FOREIGN KEY ("work_experience_id") REFERENCES "nova_work_experience_main"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_interview_main" ADD CONSTRAINT "nova_interview_main_user_status_id_fkey" FOREIGN KEY ("user_status_id") REFERENCES "nucleus_user_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_interview_main" ADD CONSTRAINT "nova_interview_main_manpower_requisition_id_fkey" FOREIGN KEY ("manpower_requisition_id") REFERENCES "nova_manpower_requisition_main"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_interview_main" ADD CONSTRAINT "nova_interview_main_reminder_id_fkey" FOREIGN KEY ("reminder_id") REFERENCES "nova_reminder_main"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_interview_main" ADD CONSTRAINT "nova_interview_main_assigned_recruiter_fkey" FOREIGN KEY ("assigned_recruiter") REFERENCES "nucleus_employee_main"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_interview_main" ADD CONSTRAINT "nova_interview_main_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "nucleus_employee_main"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_interview_main" ADD CONSTRAINT "nova_interview_main_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "nucleus_employee_main"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_interview_main" ADD CONSTRAINT "nova_interview_main_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "nucleus_employee_main"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nova_interview_main" ADD CONSTRAINT "nova_interview_main_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "nucleus_user_main"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_user_educational_details_main" ADD CONSTRAINT "nucleus_user_educational_details_main_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "nucleus_user_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nucleus_user_experience_details_main" ADD CONSTRAINT "nucleus_user_experience_details_main_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "nucleus_user_main"("id") ON DELETE SET NULL ON UPDATE CASCADE;
