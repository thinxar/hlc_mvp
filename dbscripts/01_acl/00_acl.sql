CREATE DATABASE IF NOT EXISTS `hlc_demo`
/*!40100 DEFAULT CHARACTER SET utf8mb4 */
;

USE `hlc_demo`;

CREATE TABLE `xpm_menu` (
    `id` INT(11) unsigned NOT NULL AUTO_INCREMENT,
    `parent` INT(11) unsigned NULL DEFAULT '1',
    `name` VARCHAR(64) NOT NULL,
    `code` VARCHAR(64) NOT NULL,
    `action` VARCHAR(50) NULL DEFAULT 'summary',
    `object_id` VARCHAR(20) NULL DEFAULT NULL,
    `display_order` INT(11) NOT NULL,
    `active` SMALLINT(6) NOT NULL DEFAULT '1',
    `criteria` VARCHAR(300) NULL DEFAULT NULL,
    `page_ref` VARCHAR(64) NULL DEFAULT NULL,
    `icon` VARCHAR(50) NULL DEFAULT NULL,
    `category` SMALLINT(6) NULL DEFAULT '1',
    `external_url` VARCHAR(255) NULL DEFAULT NULL,
    `created_by` VARCHAR(128) NOT NULL,
    `last_upd_by` VARCHAR(128) NULL,
    `created_on` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `last_upd_on` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE INDEX `UQ_Page_Code_Action` (`code`, `action`, object_id) USING BTREE,
    CONSTRAINT `FK_page_parent` FOREIGN KEY (`parent`) REFERENCES `xpm_menu` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `mst_user_type` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `user_type` varchar(24) NOT NULL,
    `description` varchar(128) NULL,
    `created_by` varchar(128) NOT NULL,
    `created_on` datetime NOT NULL,
    `last_upd_by` varchar(128) DEFAULT NULL,
    `last_upd_on` datetime DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_mst_user_type_user_type` (`user_type`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cmn_designation` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `code` varchar(32) NOT NULL,
    `name` varchar(64) NOT NULL,
    `description` varchar(256) NULL,
    `created_by` varchar(128) NOT NULL,
    `created_on` datetime NOT NULL,
    `last_upd_by` varchar(128) DEFAULT NULL,
    `last_upd_on` datetime DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_cmn_designation_name` (`name`),
    UNIQUE KEY `uq_cmn_designation_code` (`code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mst_organization` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(32) NOT NULL,
  `name` varchar(64) NOT NULL,
  `created_by` varchar(128) NOT NULL,
  `created_on` datetime NOT NULL,
  `last_upd_by` varchar(128) DEFAULT NULL,
  `last_upd_on` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_mst_organization_name` (`name`),
  UNIQUE KEY `uq_mst_organization_code` (`code`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `xpm_user` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `display_name` varchar(64) NOT NULL,
    `login_name` varchar(64) NOT NULL,
    `email` varchar(64) NOT NULL,
    `gender` CHAR(1) NULL,
    `dob` DATE NULL,
    `first_name` varchar(64) NULL,
    `last_name` varchar(64) NULL,
    `user_type` int(11) unsigned NOT NULL,
    `designation` int(11) unsigned DEFAULT NULL,
    `organization` int(11) unsigned NOT NULL,
    `phone_number` varchar(64) NULL,
    `address` varchar(255) NULL,
    `display_page` int(11) unsigned NULL,
    `home_custom` varchar(128) NULL,
    `random` varchar(128) NULL,
    `salt` varchar(128) NULL,
    `created_by` varchar(128) NOT NULL,
    `created_on` datetime NOT NULL,
    `last_upd_by` varchar(128) DEFAULT NULL,
    `last_upd_on` datetime DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_xpm_user_user_name` (`login_name`),
    UNIQUE KEY `uq_xpm_user_email` (`email`),
    UNIQUE KEY `uq_first_name_last_name` (`first_name`, `last_name`),
    CONSTRAINT `FK_xpm_user_mst_user_type` FOREIGN KEY (`user_type`) REFERENCES `mst_user_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `FK_xpm_user_mst_organization` FOREIGN KEY (`organization`) REFERENCES `mst_organization` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `FK_xpm_user_cmn_designation` FOREIGN KEY (`designation`) REFERENCES `cmn_designation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `FK_xpm_user_mst_display_page` FOREIGN KEY (`display_page`) REFERENCES `xpm_menu` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `xpm_group` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(32) NOT NULL,
    `description` varchar(100) NOT NULL,
    `active` smallint(6) NOT NULL DEFAULT 1,
    `created_by` varchar(128) NOT NULL,
    `last_upd_by` varchar(128) NULL,
    `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
    `last_upd_on` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_xpm_group` (`name`)
) ENGINE = InnoDB;

CREATE TABLE `xpm_acl_user` (
    `id` BIGINT(20) unsigned NOT NULL AUTO_INCREMENT,
    `group_id` INT(11) unsigned NOT NULL,
    `user_id` INT(11) unsigned NOT NULL,
    `active` SMALLINT(6) NOT NULL DEFAULT '1',
    `created_by` VARCHAR(128) NOT NULL,
    `last_upd_by` VARCHAR(128) NULL,
    `created_on` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `last_upd_on` TIMESTAMP NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE INDEX `uq_xpm_acl_user` (`group_id`, `user_id`) USING BTREE,
    CONSTRAINT `FK_acl_user_group_id` FOREIGN KEY (`group_id`) REFERENCES `xpm_group` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `FK_acl_user_users_id` FOREIGN KEY (`user_id`) REFERENCES `xpm_user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE `xpm_acl_menu` (
    `id` BIGINT(20) unsigned NOT NULL AUTO_INCREMENT,
    `group_id` INT(11) unsigned NOT NULL,
    `menu_id` INT(11) unsigned NOT NULL,
    `mask` INT(11) NOT NULL,
    `granting` SMALLINT(6) NULL DEFAULT 0,
    `audit_success` SMALLINT(6) NULL DEFAULT 0,
    `audit_failure` SMALLINT(6) NULL DEFAULT 0,
    `created_by` VARCHAR(128) NOT NULL,
    `last_upd_by` VARCHAR(128) NULL,
    `created_on` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `last_upd_on` TIMESTAMP NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`) USING BTREE,
    CONSTRAINT `fk_acl_menu_group` FOREIGN KEY (`group_id`) REFERENCES `xpm_group` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT `fk_acl_menu_menu` FOREIGN KEY (`menu_id`) REFERENCES `xpm_menu` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `xpm_acl_class` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `class_name` varchar(128) NOT NULL,
    `class_code` varchar(128) NOT NULL,
    `created_by` varchar(128) NOT NULL,
    `last_upd_by` varchar(128) NULL,
    `created_on` datetime NOT NULL DEFAULT current_timestamp(),
    `last_upd_on` datetime NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_acl_class_name` (`class_name`),
    UNIQUE KEY `uq_acl_class_code` (`class_code`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `xpm_acl_permission` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `class_id` INT(11) unsigned NOT NULL,
    `parent` int(11) unsigned NULL,
    `display_order` int(11) not null,
    `name` varchar(32) NOT NULL,
    `code` varchar(16) NOT NULL,
    `operations` varchar(128) NOT NULL,
    `active` SMALLINT(6) NOT NULL DEFAULT '1',
    `created_by` VARCHAR(128) NOT NULL,
    `last_upd_by` VARCHAR(128) NULL,
    `created_on` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `last_upd_on` TIMESTAMP NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE INDEX `uq_acl_permission_code` (`class_id`, `code`) USING BTREE,
    UNIQUE INDEX `uq_acl_permission_name` (`class_id`, `name`) USING BTREE,
    CONSTRAINT `FK_acl_permission_class_id` FOREIGN KEY (`class_id`) REFERENCES `xpm_acl_class` (`id`),
    CONSTRAINT `SK_acl_permission_parent` FOREIGN KEY (`parent`) REFERENCES `xpm_acl_permission` (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `xpm_acl_menu_permission` (
    `id` BIGINT(20) unsigned NOT NULL AUTO_INCREMENT,
    `permission_id` INT(11) unsigned NOT NULL,
    `menu_id` INT(11) unsigned NOT NULL,
    `created_by` VARCHAR(128) NOT NULL,
    `last_upd_by` VARCHAR(128) NULL,
    `created_on` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `last_upd_on` TIMESTAMP NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE INDEX `uq_acl_menu_permission` (`menu_id`, `permission_id`) USING BTREE,
    CONSTRAINT `fk_acl_menu_permission_permission` FOREIGN KEY (`permission_id`) REFERENCES `xpm_acl_permission` (`id`),
    CONSTRAINT `fk_acl_menu_permission_menu` FOREIGN KEY (`menu_id`) REFERENCES `xpm_menu` (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `xpm_acl_group_permission` (
    `id` BIGINT(20) unsigned NOT NULL AUTO_INCREMENT,
    `group_id` INT(11) unsigned NOT NULL,
    `permission_id` INT(11) unsigned NOT NULL,
    `mask` INT(11) NOT NULL,
    `granting` SMALLINT(6) NULL DEFAULT 0,
    `audit_success` SMALLINT(6) NULL DEFAULT 0,
    `audit_failure` SMALLINT(6) NULL DEFAULT 0,
    `created_by` VARCHAR(128) NOT NULL,
    `last_upd_by` VARCHAR(128) NULL,
    `created_on` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `last_upd_on` TIMESTAMP NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE INDEX `uq_group_permission` (`group_id`, `permission_id`) USING BTREE,
    INDEX `idx_group_mask` (`group_id`, `mask`) USING BTREE,
    CONSTRAINT `fk_acl_group_permission_group` FOREIGN KEY (`group_id`) REFERENCES `xpm_group` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT `fk_acl_group_permission_permission` FOREIGN KEY (`permission_id`) REFERENCES `xpm_acl_permission` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE = InnoDB;