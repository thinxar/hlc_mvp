-- do not use this create statement for user

CREATE TABLE IF NOT EXISTS xpm_acl_class (
    id SERIAL PRIMARY KEY,
    class_name VARCHAR(128) NOT NULL,
    class_code VARCHAR(128) NOT NULL,
    created_by VARCHAR(128) NOT NULL,
    last_upd_by VARCHAR(128),
    created_on TIMESTAMP NOT NULL DEFAULT current_timestamp,
    last_upd_on TIMESTAMP DEFAULT current_timestamp,
    UNIQUE (class_name),
    UNIQUE (class_code)
);

CREATE TABLE IF NOT EXISTS xpm_acl_permission (
    id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL,
    parent INTEGER,
    display_order INTEGER NOT NULL,
    name VARCHAR(32) NOT NULL,
    code VARCHAR(16) NOT NULL,
    operations VARCHAR(128) NOT NULL,
    active SMALLINT NOT NULL DEFAULT 1,
    created_by VARCHAR(128) NOT NULL,
    last_upd_by VARCHAR(128),
    created_on TIMESTAMP NOT NULL DEFAULT current_timestamp,
    last_upd_on TIMESTAMP DEFAULT current_timestamp,
    UNIQUE (class_id, code),
    UNIQUE (class_id, name),
    CONSTRAINT fk_acl_permission_class_id FOREIGN KEY (class_id) REFERENCES xpm_acl_class (id),
    CONSTRAINT fk_acl_permission_parent FOREIGN KEY (parent) REFERENCES xpm_acl_permission (id)
);

CREATE TABLE IF NOT EXISTS xpm_acl_menu_permission (
    id BIGSERIAL PRIMARY KEY,
    permission_id INTEGER NOT NULL,
    menu_id INTEGER NOT NULL,
    created_by VARCHAR(128) NOT NULL,
    last_upd_by VARCHAR(128),
    created_on TIMESTAMP NOT NULL DEFAULT current_timestamp,
    last_upd_on TIMESTAMP DEFAULT current_timestamp,
    UNIQUE (menu_id, permission_id),
    CONSTRAINT fk_acl_menu_permission_permission FOREIGN KEY (permission_id) REFERENCES xpm_acl_permission (id),
    CONSTRAINT fk_acl_menu_permission_menu FOREIGN KEY (menu_id) REFERENCES xpm_menu (id)
);

CREATE TABLE IF NOT EXISTS xpm_acl_group_permission (
    id BIGSERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    mask INTEGER NOT NULL,
    granting SMALLINT DEFAULT 0,
    audit_success SMALLINT DEFAULT 0,
    audit_failure SMALLINT DEFAULT 0,
    created_by VARCHAR(128) NOT NULL,
    last_upd_by VARCHAR(128),
    created_on TIMESTAMP NOT NULL DEFAULT current_timestamp,
    last_upd_on TIMESTAMP DEFAULT current_timestamp,
    UNIQUE (group_id, permission_id),
    CONSTRAINT fk_acl_group_permission_group FOREIGN KEY (group_id) REFERENCES xpm_group (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT fk_acl_group_permission_permission FOREIGN KEY (permission_id) REFERENCES xpm_acl_permission (id) ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE INDEX idx_group_mask ON xpm_acl_group_permission (group_id, mask);
