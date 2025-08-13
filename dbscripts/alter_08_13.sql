ALTER TABLE dms_policy
ALTER COLUMN policy_status TYPE varchar(16);

ALTER TABLE dms_policy
DROP COLUMN doc;

ALTER TABLE dms_policy
DROP COLUMN region;

ALTER TABLE dms_policy
RENAME COLUMN policy_date TO doc;

ALTER TABLE dms_policy
RENAME COLUMN name TO customer_name;

ALTER TABLE dms_policy
RENAME COLUMN dob TO customer_dob;

ALTER TABLE dms_policy
RENAME COLUMN branch_number TO batch_number;

UPDATE dms_policy
SET policy_status = NULL
WHERE trim(policy_status) = '';


ALTER TABLE dms_policy
ALTER COLUMN policy_status SET DATA TYPE int8 USING policy_status::int8;
