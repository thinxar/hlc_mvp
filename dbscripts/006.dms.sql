CREATE TABLE dms_policy (
    id bigserial NOT NULL,
    policy_number bigint NOT NULL,
    policy_date date NULL,
    customer_id varchar(16) NULL,
    name varchar(50) NULL,
    dob date NULL,
    doc date NULL,
    division_code bigint NULL,
    branch_code varchar(4) NULL,
    branch_number varchar(13) NULL,
    box_number varchar(16) NULL,
    rms_status int4 NULL,
    upload_label varchar(50) NULL,
    field1 bigint NULL,
    field2 varchar(16) NULL,
    field3 varchar(500) NULL,
    mobile_number varchar(12) NULL,
    policy_status int4 NULL,
    region varchar(128) NULL,
    created_by varchar(128) NOT NULL,
    last_upd_by varchar(128) NULL,
    created_on timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    CONSTRAINT uq_dms_policy UNIQUE (policy_number, branch_code),
    CONSTRAINT dms_policy_pkey PRIMARY KEY (id)
);

CREATE TABLE dms_document_type (
    id bigserial NOT NULL,
    document char(2)  NOT NULL,
    description varchar(250) null,
    created_by varchar(128) NOT NULL,
    last_upd_by varchar(128) NULL,
    created_on timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    CONSTRAINT dms_document_type_pkey PRIMARY KEY (id)
);

CREATE TABLE dms_policy_file (
    id bigserial NOT NULL,
    policy_id int8 NOT NULL,
    file_name varchar(128) NULL,
    file_size int8 NULL,
    file_type varchar(16) NULL,
    docket_type bigint NULL,
    object_url varchar(500) NULL,
    created_by varchar(128) NOT NULL,
    last_upd_by varchar(128) NULL,
    created_on timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    CONSTRAINT dms_policy_file_pkey PRIMARY KEY (id),
    CONSTRAINT fk_dms_policy_file_id FOREIGN KEY (policy_id) REFERENCES dms_policy(id),
    CONSTRAINT fk_dms_docket_type FOREIGN KEY (docket_type) REFERENCES dms_document_type(id)
);