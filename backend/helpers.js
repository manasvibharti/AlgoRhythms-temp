/**
 * ============================================================================
 * AnumatiSetu — Backend Helper Utilities (User Scoped)
 * ============================================================================
 */

const { getPool } = require("./db");
const crypto = require("crypto");

async function addNotification(userId, message, type = "info") {
  if (!userId) return;
  const db = await getPool();
  const id = "NOTIF-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  const now = new Date();
  const timeLabel = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
    ", " + now.toLocaleDateString([], { month: "short", day: "numeric" });

  await db.execute(
    `INSERT INTO notifications (id, user_id, message, type, time_label, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [id, userId, message, type, timeLabel]
  );

  // Cap at 20 notifications per user
  await db.execute(`
    DELETE FROM notifications
    WHERE user_id = ? AND id NOT IN (
      SELECT id FROM (SELECT id FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20) AS t
    )
  `, [userId, userId]);
}

async function logActivity(userId, text, module = "System") {
  if (!userId) return;
  const db = await getPool();
  const id = "ACT-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  const now = new Date();
  const timestampLabel = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
    ", " + now.toLocaleDateString([], { month: "short", day: "numeric" });

  await db.execute(
    `INSERT INTO activity_log (id, user_id, text, module, timestamp_label, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [id, userId, text, module, timestampLabel]
  );

  // Cap at 25 entries per user
  await db.execute(`
    DELETE FROM activity_log
    WHERE user_id = ? AND id NOT IN (
      SELECT id FROM (SELECT id FROM activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT 25) AS t
    )
  `, [userId, userId]);
}

function generateId(prefix) {
  return prefix + "-" + Math.floor(100000 + Math.random() * 900000);
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(password + "anumatisetu_salt").digest("hex");
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

module.exports = { addNotification, logActivity, generateId, generateToken, hashPassword, todayStr };
