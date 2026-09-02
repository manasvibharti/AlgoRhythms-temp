/**
 * ============================================================================
 * AnumatiSetu — Dashboard & Notifications Routes (User Scoped)
 * ============================================================================
 */

const express = require("express");
const router = express.Router();
const { getPool } = require("../db");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

// GET /api/dashboard
router.get("/", async (req, res) => {
  try {
    const db = await getPool();

    // Profile
    const [profileRows] = await db.execute(
      "SELECT * FROM profile WHERE user_id = ?",
      [req.user.id]
    );
    const profile = profileRows.length > 0 && profileRows[0].location ? {
      businessName:     profileRows[0].business_name,
      industryType:     profileRows[0].industry_type,
      businessStage:    profileRows[0].business_stage,
      location:         profileRows[0].location,
      state:            profileRows[0].state,
      employeesCount:   profileRows[0].employees_count,
      businessCategory: profileRows[0].business_category,
    } : null;

    // Applications
    const [allApps] = await db.execute(
      "SELECT * FROM applications WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    const activeApps = allApps.filter(
      a => a.status !== "APPROVED" && a.status !== "REJECTED"
    );
    const pendingActions = allApps.filter(
      a => a.status === "CLARIFICATION REQUIRED" || a.status === "INSPECTION REQUIRED"
    );
    const recentApps = allApps.slice(0, 5).map(a => {
      let docs = [];
      if (a.documents_attached) {
        if (Array.isArray(a.documents_attached)) docs = a.documents_attached;
        else if (typeof a.documents_attached === "object") docs = Object.values(a.documents_attached);
        else {
          try { docs = JSON.parse(a.documents_attached); } catch (e) { docs = []; }
        }
      }
      return {
        id:         a.id,
        title:      a.title,
        department: a.department,
        status:     a.status,
        createdDate: a.created_date,
        documentsAttached: docs,
      };
    });

    // Requirements count from profile
    let totalRequiredApprovals = 0;
    if (profile) {
      const { computeRequirements } = require("../catalog");
      const appRows = allApps.map(a => ({ requirement_code: a.requirement_code, status: a.status }));
      totalRequiredApprovals = computeRequirements(profile, appRows).length;
    }

    // Renewals
    const [renewals] = await db.execute(
      "SELECT * FROM renewals WHERE user_id = ?",
      [req.user.id]
    );
    const now = new Date();
    const upcomingRenewals = renewals.filter(r => {
      const exp = new Date(r.expiry_date);
      const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
      return diffDays <= 60;
    });

    // Recent activity
    const [actRows] = await db.execute(
      "SELECT * FROM activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
      [req.user.id]
    );
    const recentActivities = actRows.map(a => ({
      id:        a.id,
      text:      a.text,
      module:    a.module,
      timestamp: a.timestamp_label,
    }));

    // Notifications
    const [notifRows] = await db.execute(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
      [req.user.id]
    );
    const notifications = notifRows.map(n => ({
      id:      n.id,
      message: n.message,
      type:    n.type,
      time:    n.time_label,
      read:    !!n.is_read,
    }));

    res.json({
      metrics: {
        hasProfile:              !!profile,
        profile,
        totalRequiredApprovals,
        activeApplicationsCount: activeApps.length,
        pendingActionsCount:     pendingActions.length,
        upcomingRenewalsCount:   upcomingRenewals.length,
        totalApplicationsCount:  allApps.length,
        approvedCount:           allApps.filter(a => a.status === "APPROVED").length,
      },
      recentApplications: recentApps,
      recentActivities,
      notifications,
    });
  } catch (err) {
    console.error("[Dashboard GET]", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/notifications
router.get("/notifications", async (req, res) => {
  try {
    const db = await getPool();
    const [rows] = await db.execute(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20",
      [req.user.id]
    );
    res.json(rows.map(n => ({
      id:      n.id,
      message: n.message,
      type:    n.type,
      time:    n.time_label,
      read:    !!n.is_read,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/dashboard/notifications/mark-read
router.post("/notifications/mark-read", async (req, res) => {
  try {
    const db = await getPool();
    await db.execute(
      "UPDATE notifications SET is_read = 1 WHERE user_id = ?",
      [req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
