ALTER TABLE dms_policy_file_fixed_stamp 
DROP CONSTRAINT fk_dms_policy_file_fixed_stamp_file_id;

ALTER TABLE dms_policy_file_fixed_stamp
ADD constraint fk_dms_policy_file foreign key (policy_file)references dms_policy_file(id);
