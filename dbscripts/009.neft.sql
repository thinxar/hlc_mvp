-- NEFT module tables (Postgres port of the former MongoDB collections)
-- Mirrors dms-neft JPA entities: NeftPolicyEntity, NeftDocumentTypeEntity, NeftPolicyFileEntity.
-- uid_adv_reference stores the nested UidAdvReference[] as JSON text (see UidAdvReferenceConverter).
-- Run with search_path set to the dms schema (same as 006.dms.sql).

CREATE TABLE neft_policy (
	id serial NOT NULL,
	policy_number int8 NULL,
	uid_adv_reference text NULL,
	created_by varchar(128) NULL,
	last_upd_by varchar(128) NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT neft_policy_pkey PRIMARY KEY (id)
);

CREATE TABLE neft_doc_type (
	id serial NOT NULL,
	"document" varchar(128) NOT NULL,
	description varchar(250) NULL,
	code varchar(64) NULL,
	created_by varchar(128) NULL,
	last_upd_by varchar(128) NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT neft_doc_type_pkey PRIMARY KEY (id)
);

CREATE TABLE neft_policy_file (
	id serial NOT NULL,
	policy_id int4 NULL,
	file_name varchar(128) NULL,
	file_size int8 NULL,
	file_type varchar(32) NULL,
	docket_type int4 NULL,
	object_url varchar(500) NULL,
	created_by varchar(128) NULL,
	last_upd_by varchar(128) NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT neft_policy_file_pkey PRIMARY KEY (id),
	CONSTRAINT uq_neft_policy_file_object_url UNIQUE (object_url),
	CONSTRAINT fk_neft_policy_file_policy FOREIGN KEY (policy_id) REFERENCES neft_policy(id),
	CONSTRAINT fk_neft_policy_file_docket_type FOREIGN KEY (docket_type) REFERENCES neft_doc_type(id)
);
