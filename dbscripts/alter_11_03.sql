CREATE TABLE dms.mst_fixed_stamp (
	id int8 NOT NULL,
	"name" varchar(128) NOT NULL,
	code varchar(128) NOT NULL,
	description varchar(250) NULL,
	created_by varchar(128) NOT NULL,
	last_upd_by varchar(128) NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL
);