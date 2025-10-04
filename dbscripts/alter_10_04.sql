CREATE TABLE mst_endorsement_type (
	id BIGINT NOT NULL,
	name varchar(64) NOT NULL,
    code varchar(64) NOT NULL,
	description varchar(250) NULL,
	created_by varchar(128) NOT NULL,
	last_upd_by varchar(128) NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT mst_endorsement_type_pkey PRIMARY KEY (id)
);

CREATE TABLE mst_endorsement_sub_type (
	id BIGINT NOT NULL,
    endorsement_type int8 NOT NULL,
	name varchar(128) NOT NULL,
    code varchar(128) NOT NULL,
	description varchar(250) NULL,
	created_by varchar(128) NOT NULL,
	last_upd_by varchar(128) NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT mst_endorsement_sub_type_pkey PRIMARY KEY (id),
    CONSTRAINT fk_mst_endorsement_sub_type_endorsement_type FOREIGN KEY (endorsement_type) REFERENCES mst_endorsement_type(id)
);