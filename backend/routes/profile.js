/**
 * ============================================================================
 * AnumatiSetu — Profile Routes (User Scoped)
 * ============================================================================
 */

const express = require("express");
const router = express.Router();
const { getPool } = require("../db");
const { computeRequirements } = require("../catalog");
const { logActivity } = require("../helpers");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

// GET /api/profile
router.get("/", async (req, res) => {
  try {
    const db = await getPool();
    const [rows] = await db.execute(
      "SELECT * FROM profile WHERE user_id = ?",
      [req.user.id]
    );
    if (rows.length === 0) return res.json(null);

    const row = rows[0];
    res.json({
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
    });
  } catch (err) {
    console.error("[Profile GET]", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/profile
router.post("/", async (req, res) => {
  const { businessName, industryType, businessStage, location, state,
          investmentScale, employeesCount, businessCategory } = req.body;

  if (!businessName || !location) {
    return res.status(400).json({ error: "businessName and location are required." });
  }

  try {
    const db = await getPool();
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
    `, [req.user.id, businessName.trim(), industryType, businessStage, location.trim(), state,
        investmentScale, parseInt(employeesCount) || 0, businessCategory]);

    // Also update users.business_name
    await db.execute(
      "UPDATE users SET business_name = ? WHERE id = ?",
      [businessName.trim(), req.user.id]
    );

    await logActivity(req.user.id, `Business Profile updated: ${businessName.trim()}`, "Profile");

    res.json({ success: true, businessName: businessName.trim() });
  } catch (err) {
    console.error("[Profile POST]", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/profile/requirements
router.get("/requirements", async (req, res) => {
  try {
    const db = await getPool();
    const [profileRows] = await db.execute(
      "SELECT * FROM profile WHERE user_id = ?",
      [req.user.id]
    );
    if (profileRows.length === 0) return res.json([]);

    const row = profileRows[0];
    const profile = {
      industryType:     row.industry_type,
      employeesCount:   row.employees_count,
      businessCategory: row.business_category,
    };

    const [appRows] = await db.execute(
      "SELECT requirement_code, status FROM applications WHERE user_id = ?",
      [req.user.id]
    );

    const requirements = computeRequirements(profile, appRows);
    res.json(requirements);
  } catch (err) {
    console.error("[Profile Requirements GET]", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
