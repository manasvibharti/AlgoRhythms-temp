/**
 * ============================================================================
 * AnumatiSetu — Auth Middleware
 * ============================================================================
 */

const { getPool } = require("../db");

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required. Please sign in." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const db = await getPool();
    const [sessions] = await db.execute(
      `SELECT s.token, u.id, u.email, u.business_name
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.token = ?`,
      [token]
    );

    if (sessions.length === 0) {
      return res.status(401).json({ error: "Session expired or invalid. Please sign in again." });
    }

    req.user = {
      id: sessions[0].id,
      email: sessions[0].email,
      businessName: sessions[0].business_name,
      token: sessions[0].token,
    };

    next();
  } catch (err) {
    console.error("[Auth Middleware Error]", err);
    res.status(500).json({ error: "Authentication check failed" });
  }
}

module.exports = { requireAuth };
