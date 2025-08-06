CREATE TABLE dms_policy (
    id bigserial NOT NULL,
    policy_number varchar(128) NOT NULL,
    policy_date varchar(128) NOT NULL,
    policy_status int4 NULL,
    region varchar(128) NULL,
    created_by varchar(128) NOT NULL,
    last_upd_by varchar(128) NULL,
    created_on timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    CONSTRAINT uq_dms_policy UNIQUE (policy_number),
    CONSTRAINT dms_policy_pkey PRIMARY KEY (id)

);

CREATE TABLE dms_policy_file (
    id bigserial NOT NULL,
    policy_file_id int8 NOT NULL,
    position varchar(128) NULL,
    policy_number varchar(128) NULL,
    file_name varchar(128) NULL,
    file_size int8 NULL,
    file_type varchar(128) NULL,
    uuid varchar(256) NULL,
    current_offset bigint NULL,
    file_status int4 NULL,
    file_location varchar(258) NULL,
    created_by varchar(128) NOT NULL,
    last_upd_by varchar(128) NULL,
    created_on timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    CONSTRAINT dms_policy_file_pkey PRIMARY KEY (id),
    CONSTRAINT fk_dms_policy_file_id FOREIGN KEY (policy_file_id) REFERENCES dms_policy(id)
);