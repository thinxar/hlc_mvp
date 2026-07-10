-- Ananda module tables (Postgres port of the former MongoDB collections)
-- Mirrors dms-ananda JPA entities: AndProposalEntity, AndDocumentTypeEntity, AndProposalFileEntity.
-- Run with search_path set to the dms schema (same as 006.dms.sql).

CREATE TABLE and_policy (
	id serial NOT NULL,
	policy_number int8 NULL,
	agent_code varchar(64) NULL,
	ack_no varchar(64) NULL,
	la_name varchar(128) NULL,
	proposal_type varchar(64) NULL,
	proposal_no varchar(64) NULL,
	"year" varchar(8) NULL,
	bo_code varchar(16) NULL,
	plan_code varchar(32) NULL,
	object_submitted_on varchar(64) NULL,
	request_time varchar(64) NULL,
	process_time varchar(64) NULL,
	created_by varchar(128) NULL,
	last_upd_by varchar(128) NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT and_policy_pkey PRIMARY KEY (id),
	CONSTRAINT uq_and_policy_proposal_bo UNIQUE (proposal_no, bo_code)
);

CREATE TABLE and_doc_type (
	id serial NOT NULL,
	"document" varchar(128) NOT NULL,
	description varchar(250) NULL,
	code varchar(64) NULL,
	created_by varchar(128) NULL,
	last_upd_by varchar(128) NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT and_doc_type_pkey PRIMARY KEY (id)
);

CREATE TABLE and_policy_file (
	id serial NOT NULL,
	policy_id int4 NULL,
	file_name varchar(128) NULL,
	file_size int8 NULL,
	file_type varchar(32) NULL,
	docket_type int4 NULL,
	object_url varchar(500) NULL,
	status varchar(32) NULL,
	action_on timestamp NULL,
	action_by varchar(128) NULL,
	created_by varchar(128) NULL,
	last_upd_by varchar(128) NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT and_policy_file_pkey PRIMARY KEY (id),
	CONSTRAINT uq_and_policy_file_object_url UNIQUE (object_url),
	CONSTRAINT fk_and_policy_file_policy FOREIGN KEY (policy_id) REFERENCES and_policy(id),
	CONSTRAINT fk_and_policy_file_docket_type FOREIGN KEY (docket_type) REFERENCES and_doc_type(id)
);
