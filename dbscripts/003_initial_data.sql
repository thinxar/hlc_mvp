INSERT INTO mst_user_type (user_type, description,created_by,created_on)
VALUES 
  ('Admin', 'Administrators have the highest level of access to an account','admin',current_timestamp),
  ('Power User', 'Power Users know how Application actually performing','admin',current_timestamp),
  ('End User', 'End User will have limited access to the account','admin',current_timestamp);

INSERT INTO xpm_menu (id, parent, name, code, display_order, created_by, created_on) 
values
(1,null,'Administration','Administration',1,'admin',current_timestamp),
(2,1, 'User Management', 'userMgmt', 1, 'admin', current_timestamp),
(3,2, 'Users', 'admin/userManagement', 1, 'admin', current_timestamp),
(4,2, 'Groups', 'admin/groups', 2, 'admin', current_timestamp);

INSERT INTO xpm_user (id,display_name, login_name, email, gender, dob, first_name, last_name, user_type, phone_number, flat_no, street, city, state, pincode, display_page, random, salt, created_by, created_on, last_upd_by, last_upd_on) VALUES
    (1,'Admin', 'admin@gmail.com','admin@gmail.com', 'M', '2023-09-04', 'Admin', 'Admin', 1,'9874839383','0/001', 'West Street', 'Chennai', '33', '600028', 1, NULL, 'ad', 'raja', current_timestamp, NULL, NULL);

INSERT INTO mst_document_type (document, description,created_by,created_on)
VALUES 
  ('Policy', null,'admin',current_timestamp),
  ('POA', null,'admin',current_timestamp),
  ('POI', null,'admin',current_timestamp),
  ('Proposal', null,'admin',current_timestamp),
  ('Medical', null,'admin',current_timestamp);