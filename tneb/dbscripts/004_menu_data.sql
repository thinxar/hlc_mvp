--  Parent - Respective Parent_id for the Child otherwise It's null.. 
-- Display Order - Menu Showing Order in Sidebar..
-- Code - Child Menu Path ( Enter the same path as you have entered in the appRoutes )..

INSERT INTO xpm_group (name,description, active, created_by, created_on) values
('admin','admin',1,'admin',current_timestamp);

INSERT INTO xpm_acl_user (group_id,user_id, active, created_by, created_on) 
values
(1,1,1,'admin',current_timestamp);

INSERT INTO xpm_acl_menu (group_id, menu_id, mask, created_by, created_on) 
values
(1,1,2,'admin',current_timestamp),
(1,2,1,'admin',current_timestamp),
(1,3,2,'admin',current_timestamp),
(1,4,2,'admin',current_timestamp);