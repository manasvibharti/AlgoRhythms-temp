/**
 * ============================================================================
 * AnumatiSetu — Applications Routes (User Scoped)
 * ============================================================================
 */

const express = require("express");
const router = express.Router();
const { getPool } = require("../db");
const { STATUTORY_CATALOG, STATE_DEPARTMENT_REGISTRY } = require("../catalog");
const { addNotification, logActivity, generateId, todayStr } = require("../helpers");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

function parseDocsAttached(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "object") return Object.values(val);
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function parseApp(row) {
  return {
    id:                   row.id,
    requirementCode:      row.requirement_code,
    title:                row.title,
    department:           row.department,
    category:             row.category,
    status:               row.status,
    submittedDate:        row.submitted_date,
    createdDate:          row.created_date,
    inspectionRequired:   !!row.inspection_required,
    inspectionDate:       row.inspection_date,
    clarificationMessage: row.clarification_message,
    notes:                row.notes,
    documentsAttached:    parseDocsAttached(row.documents_attached),
    createdAt:            row.created_at,
  };
}

// GET /api/applications
router.get("/", async (req, res) => {
  try {
    const db = await getPool();
    const statusFilter = req.query.status;
    let rows;
    if (statusFilter && statusFilter !== "ALL") {
      [rows] = await db.execute(
        "SELECT * FROM applications WHERE user_id = ? AND UPPER(status) = UPPER(?) ORDER BY created_at DESC",
        [req.user.id, statusFilter]
      );
    } else {
      [rows] = await db.execute(
        "SELECT * FROM applications WHERE user_id = ? ORDER BY created_at DESC",
        [req.user.id]
      );
    }
    res.json(rows.map(parseApp));
  } catch (err) {
    console.error("[Applications GET]", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications/:id
router.get("/:id", async (req, res) => {
  try {
    const db = await getPool();
    const [rows] = await db.execute(
      "SELECT * FROM applications WHERE user_id = ? AND id = ?",
      [req.user.id, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Application not found" });
    res.json(parseApp(rows[0]));
  } catch (err) {
    console.error("[Application GET/:id]", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/applications
router.post("/", async (req, res) => {
  const { requirementCode, notes } = req.body;
  if (!requirementCode) return res.status(400).json({ error: "requirementCode is required" });

  const catalogItem = STATUTORY_CATALOG.find(r => r.code === requirementCode);
  if (!catalogItem) return res.status(400).json({ error: "Invalid requirementCode" });

  try {
    const db = await getPool();

    // Check if application already exists for this requirement for this user
    const [existing] = await db.execute(
      "SELECT id FROM applications WHERE user_id = ? AND requirement_code = ?",
      [req.user.id, requirementCode]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "Application already exists for this requirement", existingId: existing[0].id });
    }

    // Resolve state-specific department name
    const [profRows] = await db.execute("SELECT state FROM profile WHERE user_id = ?", [req.user.id]);
    const userState = (profRows.length > 0 && profRows[0].state) ? profRows[0].state : "Other";
    const stateMap = (STATE_DEPARTMENT_REGISTRY && STATE_DEPARTMENT_REGISTRY[userState]) 
      ? STATE_DEPARTMENT_REGISTRY[userState] 
      : (STATE_DEPARTMENT_REGISTRY?.["Other"] || {});

    const resolvedDept = catalogItem.deptKey 
      ? (stateMap[catalogItem.deptKey] || catalogItem.defaultDept || catalogItem.department || "Statutory Authority")
      : (catalogItem.department || catalogItem.defaultDept || "Statutory Authority");

    const newId = generateId ? generateId("APP") : ("APP-" + Math.floor(100000 + Math.random() * 900000));
    const today = todayStr ? todayStr() : new Date().toISOString().split("T")[0];

    await db.execute(`
      INSERT INTO applications
        (id, user_id, requirement_code, title, department, category, status,
         created_date, inspection_required, notes, documents_attached)
      VALUES (?, ?, ?, ?, ?, ?, 'DRAFT', ?, ?, ?, '[]')
    `, [
      newId,
      req.user.id,
      catalogItem.code,
      catalogItem.title,
      resolvedDept,
      catalogItem.category || "General Business",
      today,
      catalogItem.inspectionRequired ? 1 : 0,
      notes || "",
    ]);

    if (logActivity) {
      await logActivity(req.user.id, `Draft application created: ${catalogItem.title} (${newId})`, "Application");
    }
    if (addNotification) {
      await addNotification(req.user.id, `Draft created for ${catalogItem.title}`, "info");
    }

    const [rows] = await db.execute("SELECT * FROM applications WHERE id = ?", [newId]);
    res.status(201).json(parseApp(rows[0]));
  } catch (err) {
    console.error("[Application POST]", err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/applications/:id/status
router.patch("/:id/status", async (req, res) => {
  const { status, clarificationMessage, inspectionDate, notes } = req.body;
  const appId = req.params.id;

  if (!status) return res.status(400).json({ error: "status is required" });

  try {
    const db = await getPool();
    const [rows] = await db.execute(
      "SELECT * FROM applications WHERE user_id = ? AND id = ?",
      [req.user.id, appId]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Application not found" });

    const app = rows[0];
    const oldStatus = app.status;

    const updates = ["status = ?"];
    const params = [status];

    const today = todayStr ? todayStr() : new Date().toISOString().split("T")[0];

    if (status === "SUBMITTED" && !app.submitted_date) {
      updates.push("submitted_date = ?");
      params.push(today);
    }
    if (clarificationMessage !== undefined) {
      updates.push("clarification_message = ?");
      params.push(clarificationMessage ?? null);
    }
    if (inspectionDate !== undefined) {
      updates.push("inspection_date = ?");
      params.push(inspectionDate ?? null);
    }
    if (notes !== undefined) {
      updates.push("notes = ?");
      params.push(notes ?? "");
    }

    params.push(req.user.id, appId);
    await db.execute(
      `UPDATE applications SET ${updates.join(", ")} WHERE user_id = ? AND id = ?`,
      params
    );

    // If APPROVED → register license for renewal tracking
    if (status === "APPROVED") {
      await registerApprovedLicense(db, req.user.id, parseApp(rows[0]));
    }

    const notifTypeMap = {
      APPROVED: "success",
      "CLARIFICATION REQUIRED": "warning",
      "INSPECTION REQUIRED": "warning",
      REJECTED: "danger",
    };
    if (logActivity) {
      await logActivity(req.user.id, `Application ${appId} (${app.title}) changed from ${oldStatus} to ${status}`, "Application");
    }
    if (addNotification) {
      await addNotification(req.user.id, `Application ${appId} updated to ${status}`, notifTypeMap[status] || "info");
    }

    const [updated] = await db.execute("SELECT * FROM applications WHERE id = ?", [appId]);
    res.json(parseApp(updated[0]));
  } catch (err) {
    console.error("[Application PATCH status]", err);
    res.status(500).json({ error: err.message });
  }
});

async function registerApprovedLicense(db, userId, application) {
  const [existing] = await db.execute(
    "SELECT id FROM renewals WHERE user_id = ? AND application_id = ?",
    [userId, application.id]
  );
  if (existing.length > 0) return;

  const catalogItem = STATUTORY_CATALOG.find(r => r.code === application.requirementCode);
  const validityYears = catalogItem ? catalogItem.validityYears : 1;

  const issueDate = new Date();
  const expiryDate = new Date();
  expiryDate.setFullYear(issueDate.getFullYear() + validityYears);

  const newId = generateId ? generateId("LIC") : ("LIC-" + Math.floor(100000 + Math.random() * 900000));
  const licenseNumber = `SETU/${(application.category || "GEN").substring(0, 3).toUpperCase()}/${Math.floor(1000 + Math.random() * 9000)}`;

  await db.execute(`
    INSERT INTO renewals
      (id, user_id, application_id, requirement_code, title, department,
       license_number, issue_date, expiry_date, validity_years, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
  `, [
    newId,
    userId,
    application.id,
    application.requirementCode,
    application.title,
    application.department,
    licenseNumber,
    issueDate.toISOString().split("T")[0],
    expiryDate.toISOString().split("T")[0],
    validityYears,
  ]);

  if (logActivity) {
    await logActivity(userId, `License registered for renewal tracking: ${application.title} (${licenseNumber})`, "Renewals");
  }
}

module.exports = router;
