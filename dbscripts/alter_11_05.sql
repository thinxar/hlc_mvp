ALTER TABLE mst_fixed_stamp 
ADD CONSTRAINT mst_fixed_stamp_p_key PRIMARY KEY (id);

CREATE TABLE dms_policy_file_fixed_stamp (
	id bigserial NOT NULL,
	policy_file int8 NOT NULL,
	stamp int8 NOT NULL,
	created_by varchar(128) NOT NULL,
	last_upd_by varchar(128) NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT dms_policy_file_fixed_stamp_p_key PRIMARY KEY (id),
	CONSTRAINT uq_dms_policy_file_stamp UNIQUE (policy_file, stamp),
	CONSTRAINT fk_dms_policy_file_fixed_stamp_file_id FOREIGN KEY (policy_file) REFERENCES dms.dms_policy_file(id),
	CONSTRAINT fk_dms_policy_file_fixed_stamp_stamp FOREIGN KEY (stamp) REFERENCES dms.mst_fixed_stamp(id)
);