/**
 * ============================================================================
 * AnumatiSetu — Authentication Routes
 * POST /api/auth/register  → Create new enterprise user account
 * POST /api/auth/login     → Sign in and receive token
 * GET  /api/auth/me        → Get current user info & active profile
 * POST /api/auth/logout    → Sign out
 * ============================================================================
 */

const express = require("express");
const router = express.Router();
const { getPool } = require("../db");
const { generateId, generateToken, hashPassword, logActivity, addNotification } = require("../helpers");
const { requireAuth } = require("../middleware/auth");

// POST /api/auth/register-and-profile (Atomic 1-step registration & profile creation)
router.post("/register-and-profile", async (req, res) => {
  const { email, password, businessName, industryType, businessStage, location, state,
          investmentScale, employeesCount, businessCategory } = req.body;

  if (!businessName || !location) {
    return res.status(400).json({ error: "Business name and operating location are required." });
  }

  const cleanEmail = (email || `user_${Date.now()}@company.local`).trim().toLowerCase();
  const rawPassword = password && password.length >= 6 ? password : "Password@123";

  try {
    const db = await getPool();

    // Check if email already exists
    let userId, token;
    const [existing] = await db.execute("SELECT id FROM users WHERE email = ?", [cleanEmail]);

    if (existing.length > 0) {
      userId = existing[0].id;
      token = generateToken();
      await db.execute(`INSERT INTO sessions (token, user_id) VALUES (?, ?)`, [token, userId]);
    } else {
      userId = generateId("USR");
      const passwordHash = hashPassword(rawPassword);
      token = generateToken();

      await db.execute(
        `INSERT INTO users (id, email, password_hash, business_name) VALUES (?, ?, ?, ?)`,
        [userId, cleanEmail, passwordHash, businessName.trim()]
      );

      await db.execute(
        `INSERT INTO sessions (token, user_id) VALUES (?, ?)`,
        [token, userId]
      );
    }

    // Upsert full profile
    await db.execute(`
      INSERT INTO profile
        (user_id, business_name, industry_type, business_stage, location, state,
         investment_scale, employees_count, business_category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        business_name     = VALUES(business_name),
        industry_type     = VALUES(industry_type),
        business_stage    = VALUES(business_stage),
        location          = VALUES(location),
        state             = VALUES(state),
        investment_scale  = VALUES(investment_scale),
        employees_count   = VALUES(employees_count),
        business_category = VALUES(business_category)
    `, [userId, businessName.trim(), industryType || "Manufacturing", businessStage || "New Setup",
        location.trim(), state || "Karnataka", investmentScale || "",
        parseInt(employeesCount) || 0, businessCategory || "Small Enterprise"]);

    await logActivity(userId, `Business profile created for ${businessName.trim()}`, "Profile");
    await addNotification(userId, `Profile created! Statutory clearances have been calculated for ${businessName.trim()}.`, "success");

    res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        email: cleanEmail,
        businessName: businessName.trim(),
      },
      profile: {
        businessName: businessName.trim(),
        industryType,
        location: location.trim(),
        state,
        employeesCount,
      }
    });
  } catch (err) {
    console.error("[Auth Register & Profile Error]", err);
    res.status(500).json({ error: err.message || "Failed to create profile" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const db = await getPool();
    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = hashPassword(password);

    const [rows] = await db.execute(
      `SELECT id, email, business_name FROM users WHERE email = ? AND password_hash = ?`,
      [cleanEmail, passwordHash]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = rows[0];
    const token = generateToken();

    // Store session
    await db.execute(
      `INSERT INTO sessions (token, user_id) VALUES (?, ?)`,
      [token, user.id]
    );

    await logActivity(user.id, `User logged in`, "Auth");

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        businessName: user.business_name,
      },
    });
  } catch (err) {
    console.error("[Auth Login Error]", err);
    res.status(500).json({ error: err.message || "Login failed" });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const db = await getPool();
    const [profileRows] = await db.execute(
      "SELECT * FROM profile WHERE user_id = ?",
      [req.user.id]
    );

    let profile = null;
    if (profileRows.length > 0) {
      const row = profileRows[0];
      profile = {
        businessName:     row.business_name,
        industryType:     row.industry_type,
        businessStage:    row.business_stage,
        location:         row.location,
        state:            row.state,
        investmentScale:  row.investment_scale,
        employeesCount:   row.employees_count,
        businessCategory: row.business_category,
        updatedAt:        row.updated_at,
        isComplete:       !!(row.business_name && row.location),
      };
    }

    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        businessName: req.user.businessName,
      },
      profile,
    });
  } catch (err) {
    console.error("[Auth Me Error]", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/logout
router.post("/logout", requireAuth, async (req, res) => {
  try {
    const db = await getPool();
    await db.execute("DELETE FROM sessions WHERE token = ?", [req.user.token]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
