ALTER TABLE dms_document_type RENAME TO mst_document_type;

ALTER TABLE mst_document_type 
ADD CONSTRAINT uq_mst_document_type_document UNIQUE (document);

ALTER TABLE mst_document_type
ALTER COLUMN document TYPE VARCHAR(128);

alter table dms_policy_file
add constraint uq_dms_policy_file_object_url unique (object_url);