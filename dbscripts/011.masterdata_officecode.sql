-- Master-data lookup tables for the office-code / SR-no handlers added to dms-masterdata.
-- Backs the models AndOfficeCodeModel, PbzOfficeCodeModel, RevOfficeCodeModel, RevSrNoModel
-- (@PalmyraType AndOfficeCode / PbzOfficeCode / RevOfficeCode / RevSrNo) and their
-- QueryHandler/ReadHandler/SaveHandler handlers. Columns: id, code, name, description.
-- Audit columns are nullable so the seed inserts (id, code, name, description) load as-is
-- while the SaveHandler create/update path can still populate them.
-- Run with search_path set to the dms schema (same as 006.dms.sql).

CREATE TABLE and_office_code (
	id serial NOT NULL,
	code varchar(64) NULL,
	"name" varchar(128) NULL,
	description varchar(250) NULL,
	created_by varchar(128) NULL,
	last_upd_by varchar(128) NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT and_office_code_pkey PRIMARY KEY (id)
);

CREATE TABLE pbz_office_code (
	id serial NOT NULL,
	code varchar(64) NULL,
	"name" varchar(128) NULL,
	description varchar(250) NULL,
	created_by varchar(128) NULL,
	last_upd_by varchar(128) NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT pbz_office_code_pkey PRIMARY KEY (id)
);

CREATE TABLE rev_office_code (
	id serial NOT NULL,
	code varchar(64) NULL,
	"name" varchar(128) NULL,
	description varchar(250) NULL,
	created_by varchar(128) NULL,
	last_upd_by varchar(128) NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT rev_office_code_pkey PRIMARY KEY (id)
);

CREATE TABLE rev_sr_no (
	id serial NOT NULL,
	code varchar(64) NULL,
	"name" varchar(128) NULL,
	description varchar(250) NULL,
	created_by varchar(128) NULL,
	last_upd_by varchar(128) NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT rev_sr_no_pkey PRIMARY KEY (id)
);
