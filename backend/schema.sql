-- ============================================================================
-- AnumatiSetu Database Export & DDL Schema
-- Database Name: anumatisetu_db
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `anumatisetu_db`
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `anumatisetu_db`;

-- ----------------------------------------------------------------------------
-- 1. Users Table (Enterprise Authentication)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`            VARCHAR(50) PRIMARY KEY,
  `email`         VARCHAR(255) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `business_name` VARCHAR(255) NOT NULL,
  `created_at`    DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Sessions Table (Active Auth Tokens)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sessions` (
  `token`      VARCHAR(255) PRIMARY KEY,
  `user_id`    VARCHAR(50) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Business Profile Table (1-to-1 with Enterprise User)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `profile` (
  `user_id`           VARCHAR(50) PRIMARY KEY,
  `business_name`     VARCHAR(255),
  `industry_type`     VARCHAR(100),
  `business_stage`    VARCHAR(100),
  `location`          VARCHAR(255),
  `state`             VARCHAR(100),
  `investment_scale`  VARCHAR(100),
  `employees_count`   INT DEFAULT 0,
  `business_category` VARCHAR(100),
  `updated_at`        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Applications Table (Statutory Clearance Workflows)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `applications` (
  `id`                    VARCHAR(20)  PRIMARY KEY,
  `user_id`               VARCHAR(50)  NOT NULL,
  `requirement_code`      VARCHAR(100) NOT NULL,
  `title`                 VARCHAR(255),
  `department`            VARCHAR(255),
  `category`              VARCHAR(100),
  `status`                VARCHAR(50)  DEFAULT 'DRAFT',
  `submitted_date`        DATE,
  `created_date`          DATE,
  `inspection_required`   TINYINT(1)   DEFAULT 0,
  `inspection_date`       DATE,
  `clarification_message` TEXT,
  `notes`                 TEXT,
  `documents_attached`    JSON,
  `created_at`            DATETIME     DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_apps` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Documents Table (Statutory Document Vault)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `documents` (
  `id`             VARCHAR(20)  PRIMARY KEY,
  `user_id`        VARCHAR(50)  NOT NULL,
  `name`           VARCHAR(255),
  `category`       VARCHAR(100),
  `file_name`      VARCHAR(255),
  `file_path`      VARCHAR(500),
  `file_size`      VARCHAR(50),
  `uploaded_date`  DATE,
  `status`         VARCHAR(50)  DEFAULT 'UPLOADED',
  `application_id` VARCHAR(20),
  `has_file`       TINYINT(1)   DEFAULT 0,
  `created_at`     DATETIME     DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_docs` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. Renewals Table (Active Licenses & Expiry Countdown)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `renewals` (
  `id`               VARCHAR(20)  PRIMARY KEY,
  `user_id`          VARCHAR(50)  NOT NULL,
  `application_id`   VARCHAR(20),
  `requirement_code` VARCHAR(100),
  `title`            VARCHAR(255),
  `department`       VARCHAR(255),
  `license_number`   VARCHAR(100),
  `issue_date`       DATE,
  `expiry_date`      DATE,
  `validity_years`   INT          DEFAULT 1,
  `status`           VARCHAR(50)  DEFAULT 'ACTIVE',
  `created_at`       DATETIME     DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_renewals` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. Notifications Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notifications` (
  `id`         VARCHAR(50)  PRIMARY KEY,
  `user_id`    VARCHAR(50)  NOT NULL,
  `message`    TEXT,
  `type`       VARCHAR(20)  DEFAULT 'info',
  `time_label` VARCHAR(100),
  `is_read`    TINYINT(1)   DEFAULT 0,
  `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_notifs` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. Activity Log Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `activity_log` (
  `id`              VARCHAR(50) PRIMARY KEY,
  `user_id`         VARCHAR(50) NOT NULL,
  `text`            TEXT,
  `module`          VARCHAR(100) DEFAULT 'System',
  `timestamp_label` VARCHAR(100),
  `created_at`      DATETIME    DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_act` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
