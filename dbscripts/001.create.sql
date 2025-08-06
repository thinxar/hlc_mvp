CREATE DATABASE dms;

CREATE TABLE xpm_menu (
    id INT(11) unsigned NOT NULL AUTO_INCREMENT,
    parent INT(11) unsigned NULL DEFAULT '1',
    name VARCHAR(64) NOT NULL,
    display_label VARCHAR(64) NULL,
    code VARCHAR(64) NOT NULL,
    path VARCHAR(64) NULL,
    action VARCHAR(50) NULL DEFAULT 'summary',
    object_id VARCHAR(20) NULL DEFAULT NULL,
    display_order INT(11) NOT NULL,
    active SMALLINT(6) NOT NULL DEFAULT '1',
    criteria VARCHAR(300) NULL DEFAULT NULL,
    page_ref VARCHAR(64) NULL DEFAULT NULL,
    icon VARCHAR(50) NULL DEFAULT NULL,
    category SMALLINT(6) NULL DEFAULT '1',
    external_url VARCHAR(255) NULL DEFAULT NULL,
    created_by VARCHAR(128) NOT NULL,
    last_upd_by VARCHAR(128) NULL,
    created_on TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    last_upd_on TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE current_timestamp(),
    PRIMARY KEY (id) USING BTREE,
    UNIQUE INDEX UQ_Page_Code_Action (code, action, object_id) USING BTREE,
    CONSTRAINT FK_page_parent FOREIGN KEY (parent) REFERENCES xpm_menu (id) ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS mst_user_type (
  id SERIAL PRIMARY KEY,
  user_type VARCHAR(24) NOT NULL,
  description VARCHAR(128),
  created_by VARCHAR(128) NOT NULL,
  created_on TIMESTAMP NOT NULL,
  last_upd_by VARCHAR(128),
  last_upd_on TIMESTAMP,
  CONSTRAINT uq_mst_user_type_user_type UNIQUE (user_type)
);

CREATE TABLE IF NOT EXISTS xpm_user (
  id SERIAL PRIMARY KEY NOT NULL,
  display_name varchar(64) NOT NULL,
  login_name varchar(64) NOT NULL,
  email varchar(64) NOT NULL,
  gender CHAR(1) NULL,
  dob DATE NULL,
  first_name varchar(64) NULL,
  last_name varchar(64) NULL,
  user_type INTEGER  NOT NULL,
  phone_number varchar(64) NULL,
  flat_no varchar(22) NULL,
  street varchar(64) NULL,
  city varchar(64) NULL,
  state varchar(22) NULL,
  address varchar(256) NULL,
  display_page INTEGER  NULL,
  random varchar(128) NULL,
  salt varchar(128) NULL,
  active int2 DEFAULT '1'::smallint NOT NULL,
  created_by varchar(128) NOT NULL,
  created_on TIMESTAMP NOT NULL,
  last_upd_by varchar(128) DEFAULT NULL,
  last_upd_on TIMESTAMP DEFAULT NULL,
  CONSTRAINT uq_xpm_user_user_name UNIQUE(login_name),
  CONSTRAINT uq_xpm_user_email UNIQUE(email),
  CONSTRAINT uq_first_name_last_name UNIQUE(first_name, last_name),
  CONSTRAINT FK_xpm_user_mst_user_type FOREIGN KEY (user_type) REFERENCES mst_user_type (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT FK_xpm_user_mst_display_page FOREIGN KEY (display_page) REFERENCES xpm_menu (id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE xpm_group (
	id serial4 NOT NULL,
	"name" varchar(25) NOT NULL,
	description varchar(100) NOT NULL,
	active int2 DEFAULT 1 NOT NULL,
	created_by varchar(128) NOT NULL,
	last_upd_by varchar(128) NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT uq_xpm_group UNIQUE (name),
	CONSTRAINT xpm_group_pkey PRIMARY KEY (id)
);

CREATE TABLE xpm_acl_menu (
	id bigserial NOT NULL,
	group_id int4 NOT NULL,
	menu_id int4 NOT NULL,
	mask int4 NOT NULL,
	granting int2 DEFAULT 0 NULL,
	audit_success int2 DEFAULT 0 NULL,
	audit_failure int2 DEFAULT 0 NULL,
	created_by varchar(128) NOT NULL,
	last_upd_by varchar(128) NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT xpm_acl_menu_pkey PRIMARY KEY (id),
	CONSTRAINT fk_acl_menu_group FOREIGN KEY (group_id) REFERENCES xpm_group(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	CONSTRAINT fk_acl_menu_menu FOREIGN KEY (menu_id) REFERENCES xpm_menu(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE xpm_acl_user (
	id bigserial NOT NULL,
	group_id int4 NOT NULL,
	user_id int4 NOT NULL,
	active int2 DEFAULT '1'::smallint NOT NULL,
	created_by varchar(128) NOT NULL,
	last_upd_by varchar(128) NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	last_upd_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT uq_xpm_acl_user UNIQUE (group_id, user_id),
	CONSTRAINT xpm_acl_user_pkey PRIMARY KEY (id),
	CONSTRAINT fk_acl_user_group_id FOREIGN KEY (group_id) REFERENCES xpm_group(id),
	CONSTRAINT fk_acl_user_users_id FOREIGN KEY (user_id) REFERENCES xpm_user(id)
);