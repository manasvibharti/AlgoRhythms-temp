/**
 * ============================================================================
 * AnumatiSetu — MySQL Database Connection & Schema Migrations
 * ============================================================================
 */

const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "anumatisetu_db";
const DB_PORT = parseInt(process.env.DB_PORT || "3306");

let pool;

async function getPool() {
  if (pool) return pool;

  // Step 1: Bootstrap connection to ensure DB exists
  const bootstrap = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    port: DB_PORT,
  });

  await bootstrap.execute(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await bootstrap.end();

  // Step 2: Connection Pool
  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Step 3: Run Multi-User Schema Migrations
  await runMigrations(pool);

  console.log(`[DB] Connected to MySQL database '${DB_NAME}' on ${DB_HOST}:${DB_PORT}`);
  return pool;
}

async function runMigrations(db) {
  const conn = await db.getConnection();
  try {
    // 1. Users table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id            VARCHAR(50) PRIMARY KEY,
        email         VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        business_name VARCHAR(255) NOT NULL,
        created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    // 2. Sessions table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS sessions (
        token      VARCHAR(255) PRIMARY KEY,
        user_id    VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id)
      ) ENGINE=InnoDB
    `);

    // 3. Business Profile (1-to-1 with user_id)
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS profile (
        user_id          VARCHAR(50) PRIMARY KEY,
        business_name    VARCHAR(255),
        industry_type    VARCHAR(100),
        business_stage   VARCHAR(100),
        location         VARCHAR(255),
        state            VARCHAR(100),
        investment_scale VARCHAR(100),
        employees_count  INT DEFAULT 0,
        business_category VARCHAR(100),
        updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    // 4. Applications table (with user_id)
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS applications (
        id                    VARCHAR(20)  PRIMARY KEY,
        user_id               VARCHAR(50)  NOT NULL,
        requirement_code      VARCHAR(100) NOT NULL,
        title                 VARCHAR(255),
        department            VARCHAR(255),
        category              VARCHAR(100),
        status                VARCHAR(50)  DEFAULT 'DRAFT',
        submitted_date        DATE,
        created_date          DATE,
        inspection_required   TINYINT(1)   DEFAULT 0,
        inspection_date       DATE,
        clarification_message TEXT,
        notes                 TEXT,
        documents_attached    JSON,
        created_at            DATETIME     DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_apps (user_id)
      ) ENGINE=InnoDB
    `);

    // 5. Document metadata + file reference (with user_id)
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS documents (
        id             VARCHAR(20)  PRIMARY KEY,
        user_id        VARCHAR(50)  NOT NULL,
        name           VARCHAR(255),
        category       VARCHAR(100),
        file_name      VARCHAR(255),
        file_path      VARCHAR(500),
        file_size      VARCHAR(50),
        uploaded_date  DATE,
        status         VARCHAR(50)  DEFAULT 'UPLOADED',
        application_id VARCHAR(20),
        has_file       TINYINT(1)   DEFAULT 0,
        created_at     DATETIME     DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_docs (user_id)
      ) ENGINE=InnoDB
    `);

    // 6. Active license / renewal tracker (with user_id)
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS renewals (
        id               VARCHAR(20)  PRIMARY KEY,
        user_id          VARCHAR(50)  NOT NULL,
        application_id   VARCHAR(20),
        requirement_code VARCHAR(100),
        title            VARCHAR(255),
        department       VARCHAR(255),
        license_number   VARCHAR(100),
        issue_date       DATE,
        expiry_date      DATE,
        validity_years   INT          DEFAULT 1,
        status           VARCHAR(50)  DEFAULT 'ACTIVE',
        created_at       DATETIME     DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_renewals (user_id)
      ) ENGINE=InnoDB
    `);

    // 7. Notifications (with user_id)
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id         VARCHAR(50)  PRIMARY KEY,
        user_id    VARCHAR(50)  NOT NULL,
        message    TEXT,
        type       VARCHAR(20)  DEFAULT 'info',
        time_label VARCHAR(100),
        is_read    TINYINT(1)   DEFAULT 0,
        created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_notifs (user_id)
      ) ENGINE=InnoDB
    `);

    // 8. Activity log (with user_id)
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS activity_log (
        id              VARCHAR(50) PRIMARY KEY,
        user_id         VARCHAR(50) NOT NULL,
        text            TEXT,
        module          VARCHAR(100) DEFAULT 'System',
        timestamp_label VARCHAR(100),
        created_at      DATETIME    DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_act (user_id)
      ) ENGINE=InnoDB
    `);

    // Clean up any legacy single-tenant tables without user_id column
    try {
      const [cols] = await conn.execute("SHOW COLUMNS FROM profile LIKE 'user_id'");
      if (cols.length === 0) {
        console.log("[DB] Migrating legacy single-tenant tables...");
        await conn.execute("DROP TABLE IF EXISTS profile, applications, documents, renewals, notifications, activity_log");
        // Re-run migrations
        conn.release();
        return await runMigrations(db);
      }
    } catch (e) {}

    console.log("[DB] All multi-user tables verified/created.");
  } finally {
    try { conn.release(); } catch (e) {}
  }
}

module.exports = { getPool };
