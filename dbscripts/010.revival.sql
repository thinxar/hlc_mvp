-- Revival module tables (Postgres port of the former MongoDB collections)
-- Mirrors dms-revival JPA entities: RevPolicyEntity, RevDocumentTypeEntity,
-- RevPolicyFileEntity, and the reference/report entities BranchEntity,
-- DivisionEntity, CaseEntity, DailyBranchWiseReportEntity, MonthWiseReportEntity.
-- Run with search_path set to the dms schema (same as 006.dms.sql).

CREATE TABLE rev_policy (
	id serial NOT NULL,
	policy_number varchar(32) NULL,
	doc_type varchar(64) NULL,
	doc_sub_type varchar(64) NULL,
	sr_no varchar(64) NULL,
	asr_no varchar(64) NULL,
	so_code varchar(16) NULL,
	do_code varchar(16) NULL,
	date_of_submission date NULL,
	uploaded_by varchar(128) NULL,
	bo_code varchar(16) NULL,
	CONSTRAINT rev_policy_pkey PRIMARY KEY (id),
	CONSTRAINT uq_rev_policy_number_so UNIQUE (policy_number, so_code)
);

CREATE TABLE rev_doc_type (
	id serial NOT NULL,
	"document" varchar(128) NOT NULL,
	description varchar(250) NULL,
	code varchar(64) NULL,
	CONSTRAINT rev_doc_type_pkey PRIMARY KEY (id)
);

CREATE TABLE rev_policy_file (
	id serial NOT NULL,
	policy_id int4 NULL,
	file_name varchar(128) NULL,
	file_size int8 NULL,
	file_type varchar(32) NULL,
	docket_type int4 NULL,
	object_url varchar(500) NULL,
	created_on timestamp NULL,
	created_by varchar(128) NULL,
	status varchar(32) NULL,
	action_on timestamp NULL,
	action_by varchar(128) NULL,
	CONSTRAINT rev_policy_file_pkey PRIMARY KEY (id),
	CONSTRAINT uq_rev_policy_file_object_url UNIQUE (object_url),
	CONSTRAINT fk_rev_policy_file_policy FOREIGN KEY (policy_id) REFERENCES rev_policy(id),
	CONSTRAINT fk_rev_policy_file_docket_type FOREIGN KEY (docket_type) REFERENCES rev_doc_type(id)
);

CREATE TABLE rev_branch (
	id serial NOT NULL,
	zone varchar(64) NULL,
	division_name varchar(128) NULL,
	branch_code varchar(32) NULL,
	branch_name varchar(128) NULL,
	do_code varchar(16) NULL,
	CONSTRAINT rev_branch_pkey PRIMARY KEY (id)
);

CREATE TABLE rev_zone_division (
	id serial NOT NULL,
	zone varchar(64) NULL,
	division_name varchar(128) NULL,
	do_code varchar(16) NULL,
	CONSTRAINT rev_zone_division_pkey PRIMARY KEY (id)
);

CREATE TABLE rev_case (
	id varchar(64) NOT NULL,
	request_id varchar(64) NULL,
	request_date date NULL,
	do_code varchar(16) NULL,
	CONSTRAINT rev_case_pkey PRIMARY KEY (id)
);

CREATE TABLE rev_active_cases_branchwise (
	id serial NOT NULL,
	branch_code varchar(32) NULL,
	branch_name varchar(128) NULL,
	division_name varchar(128) NULL,
	do_code varchar(16) NULL,
	zone varchar(64) NULL,
	cal_date date NULL,
	pending_documents int4 NULL,
	submitted_documents int4 NULL,
	processed_documents int4 NULL,
	per_approver text NULL,
	CONSTRAINT rev_active_cases_branchwise_pkey PRIMARY KEY (id)
);

CREATE TABLE rev_active_cases_monthly_branchwise (
	id serial NOT NULL,
	branch_code varchar(32) NULL,
	branch_name varchar(128) NULL,
	division_name varchar(128) NULL,
	do_code varchar(16) NULL,
	zone varchar(64) NULL,
	cal_month date NULL,
	pending_documents int4 NULL,
	submitted_documents int4 NULL,
	processed_documents int4 NULL,
	per_approver text NULL,
	CONSTRAINT rev_active_cases_monthly_branchwise_pkey PRIMARY KEY (id)
);
