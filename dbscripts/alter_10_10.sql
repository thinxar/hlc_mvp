alter table mst_document_type add column code varchar(16) not null default 1;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) + 100 AS new_code
  FROM mst_document_type
)
UPDATE mst_document_type mdt 
SET code = n.new_code
FROM numbered n
WHERE mdt.id = n.id;