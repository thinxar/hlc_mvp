INSERT INTO and_office_code (id, code, name, description) VALUES
  (1, '101', '300', ''),
  (2, '102', '301', ''),
  (3, '103', '302', '');

-- ---- pbz_office_code  (from mst_pbz_office_code, 3 rows) ----
INSERT INTO pbz_office_code (id, code, name, description) VALUES
  (1, '101', '300', ''),
  (2, '102', '301', ''),
  (3, '103', '302', '');

-- ---- rev_office_code  (from mst_rev_office_code, 3 rows) ----
INSERT INTO rev_office_code (id, code, name, description) VALUES
  (1, '101', '300', ''),
  (2, '102', '301', ''),
  (3, '103', '302', '');

-- ---- rev_sr_no  (from mst_rev_srNo, 5 rows) ----
INSERT INTO rev_sr_no (id, code, name, description) VALUES
  (1, '101', '9823880', ''),
  (2, '102', '9823881', ''),
  (3, '103', '9823882', ''),
  (4, '104', '9823990', ''),
  (5, '105', '9823991', '');

-- ---- and_doc_type  (from and_docType, 16 rows) ----
INSERT INTO and_doc_type (id, document, description, code) VALUES
  (1, 'Proposal', 'Proposal', '101'),
  (2, 'POA', 'admin', '102'),
  (3, 'POI', 'admin', '103'),
  (4, 'Proposal', 'admin', '104'),
  (5, 'Medical', 'admin', '105'),
  (6, 'Others', 'admin', '106'),
  (7, 'Proposal Form', 'Proposal Form', '107'),
  (8, 'KYC Documents', 'KYC Documents', '108'),
  (9, 'Proposal Enclosures', 'Proposal Enclosures', '109'),
  (10, 'Signature Page', 'Signature Page', '110'),
  (11, 'Proposal Review Slip', 'Proposal Review Slip', '111'),
  (12, 'Policy Bond', 'Policy Bond', '112'),
  (13, 'Surrender', 'Surrender', '113'),
  (14, 'NEFT', 'NEFT', '114'),
  (15, 'Endorsements', 'Endorsements', '115'),
  (16, 'E Service', 'E Service', '116');

-- ---- pbz_doc_type  (from pbz_docType, 16 rows) ----
INSERT INTO pbz_doc_type (id, document, description, code) VALUES
  (1, 'Policy', 'admin', '101'),
  (2, 'POA', 'admin', '102'),
  (3, 'POI', 'admin', '103'),
  (4, 'Proposal', 'admin', '104'),
  (5, 'Medical', 'admin', '105'),
  (6, 'Others', 'admin', '106'),
  (7, 'Proposal Form', 'Proposal Form', '107'),
  (8, 'KYC Documents', 'KYC Documents', '108'),
  (9, 'Proposal Enclosures', 'Proposal Enclosures', '109'),
  (10, 'Signature Page', 'Signature Page', '110'),
  (11, 'Proposal Review Slip', 'Proposal Review Slip', '111'),
  (12, 'Policy Bond', 'Policy Bond', '112'),
  (13, 'Surrender', 'Surrender', '113'),
  (14, 'NEFT', 'NEFT', '114'),
  (15, 'Endorsements', 'Endorsements', '115'),
  (16, 'E Service', 'E Service', '116');

-- ---- rev_doc_type  (from rev_docType, 1 rows) ----
INSERT INTO rev_doc_type (id, document, description, code) VALUES
  (1, 'Revival', 'Revival', '101');

-- ---- neft_doc_type  (from neft_docType, 4 rows) ----
INSERT INTO neft_doc_type (id, document, description, code) VALUES
  (1, 'Photograph', 'Photograph', '101'),
  (2, 'NEFT', 'NEFT', '102'),
  (3, 'Signature', 'Signature', '103'),
  (4, 'others', 'others', '104');
