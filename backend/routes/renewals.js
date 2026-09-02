/**
 * ============================================================================
 * AnumatiSetu — Renewals Routes (User Scoped)
 * ============================================================================
 */

const express = require("express");
const router = express.Router();
const { getPool } = require("../db");
const { addNotification, logActivity } = require("../helpers");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

function parseRenewal(row) {
  return {
    id:             row.id,
    applicationId:  row.application_id,
    requirementCode: row.requirement_code,
    title:          row.title,
    department:     row.department,
    licenseNumber:  row.license_number,
    issueDate:      row.issue_date,
    expiryDate:     row.expiry_date,
    validityYears:  row.validity_years,
    status:         row.status,
  };
}

// GET /api/renewals
router.get("/", async (req, res) => {
  try {
    const db = await getPool();
    const [rows] = await db.execute(
      "SELECT * FROM renewals WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows.map(parseRenewal));
  } catch (err) {
    console.error("[Renewals GET]", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/renewals/:id/renew
router.post("/:id/renew", async (req, res) => {
  try {
    const db = await getPool();
    const [rows] = await db.execute(
      "SELECT * FROM renewals WHERE user_id = ? AND id = ?",
      [req.user.id, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "License record not found" });

    const r = rows[0];
    const currentExpiry = new Date(r.expiry_date);
    currentExpiry.setFullYear(currentExpiry.getFullYear() + r.validity_years);
    const newExpiry = currentExpiry.toISOString().split("T")[0];

    await db.execute(
      "UPDATE renewals SET expiry_date = ?, status = 'ACTIVE' WHERE user_id = ? AND id = ?",
      [newExpiry, req.user.id, r.id]
    );

    await logActivity(req.user.id, `License renewed: ${r.title} until ${newExpiry}`, "Renewals");
    await addNotification(req.user.id, `License renewed for ${r.title}`, "success");

    const [updated] = await db.execute(
      "SELECT * FROM renewals WHERE user_id = ? AND id = ?",
      [req.user.id, r.id]
    );
    res.json(parseRenewal(updated[0]));
  } catch (err) {
    console.error("[Renewals PATCH]", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
