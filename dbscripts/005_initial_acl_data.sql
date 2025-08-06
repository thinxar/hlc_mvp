INSERT INTO xpm_acl_class (id, class_code, class_name, created_by, created_on) 
VALUES 
    (1, 'XpmGroup', 'Group Management', 'admin', CURRENT_TIMESTAMP),
    (2, 'XpmUser', 'User Management', 'admin', CURRENT_TIMESTAMP);

INSERT INTO xpm_acl_permission (id, class_id, parent, display_order, name, code, operations, active, created_by, created_on) 
VALUES
    (1, 1, NULL, 1, 'View Group', 'RS', 'ViewGroup', 1, 'admin', CURRENT_TIMESTAMP),
    (2, 1, NULL, 2, 'Edit Group', 'CUD', 'EditGroup', 1, 'admin', CURRENT_TIMESTAMP),
    (3, 1, NULL, 3, 'Assign Users', 'ASU', 'AssignUser', 1, 'admin', CURRENT_TIMESTAMP),
    (4, 1, NULL, 4, 'Read ACL Rights', 'AclRead', 'AclRead', 1, 'admin', CURRENT_TIMESTAMP),
    (5, 1, NULL, 5, 'Edit ACL Rights', 'AclEdit', 'AclEdit', 1, 'admin', CURRENT_TIMESTAMP),
    (6, 2, NULL, 1, 'View Users', 'RS', 'UsersView', 1, 'admin', CURRENT_TIMESTAMP),
    (7, 2, NULL, 2, 'Edit Users', 'CUD', 'UsersEdit', 1, 'admin', CURRENT_TIMESTAMP),
    (8, 2, NULL, 3, 'Reset Password', 'RsPwd', 'ResetPassword', 1, 'admin', CURRENT_TIMESTAMP);


INSERT INTO xpm_acl_group_permission (group_id, permission_id, mask, granting, audit_success, audit_failure, created_by, created_on)
SELECT 
    (SELECT id FROM xpm_group WHERE name = 'admin'),
    (SELECT id FROM xpm_acl_permission WHERE code = 'AclRead'),
    1, 0, 0, 0, 'admin', CURRENT_TIMESTAMP;


INSERT INTO xpm_acl_group_permission (group_id, permission_id, mask, granting, audit_success, audit_failure, created_by, created_on)
SELECT 
    (SELECT id FROM xpm_group WHERE name = 'admin'),
    (SELECT id FROM xpm_acl_permission WHERE code = 'CUD' AND class_id = 1),
    1, 0, 0, 0, 'admin', CURRENT_TIMESTAMP;


INSERT INTO xpm_acl_group_permission (group_id, permission_id, mask, granting, audit_success, audit_failure, created_by, created_on)
SELECT 
    (SELECT id FROM xpm_group WHERE name = 'admin'),
    (SELECT id FROM xpm_acl_permission WHERE code = 'ASU' AND class_id = 1),
    1, 0, 0, 0, 'admin', CURRENT_TIMESTAMP;


INSERT INTO xpm_acl_group_permission (group_id, permission_id, mask, granting, audit_success, audit_failure, created_by, created_on)
SELECT 
    (SELECT id FROM xpm_group WHERE name = 'admin'),
    (SELECT id FROM xpm_acl_permission WHERE code = 'RS' AND class_id = 1),
    1, 0, 0, 0, 'admin', CURRENT_TIMESTAMP;


INSERT INTO xpm_acl_group_permission (group_id, permission_id, mask, granting, audit_success, audit_failure, created_by, created_on)
SELECT 
    (SELECT id FROM xpm_group WHERE name = 'admin'),
    (SELECT id FROM xpm_acl_permission WHERE code = 'AclEdit'),
    1, 0, 0, 0, 'admin', CURRENT_TIMESTAMP;

-- User Management ACL

INSERT INTO xpm_acl_group_permission (group_id, permission_id, mask, granting, audit_success, audit_failure, created_by, created_on)
SELECT 
    (SELECT id FROM xpm_group WHERE name = 'admin'),
    id, 1, 0, 0, 0, 'admin', CURRENT_TIMESTAMP
FROM xpm_acl_permission
WHERE class_id = 2;