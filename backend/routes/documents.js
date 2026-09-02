/**
 * ============================================================================
 * AnumatiSetu — Documents Routes (User Scoped)
 * ============================================================================
 */

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { getPool } = require("../db");
const { logActivity, generateId, todayStr } = require("../helpers");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const docId = generateId ? generateId("DOC") : ("DOC-" + Math.floor(100000 + Math.random() * 900000));
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${docId}_${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(pdf|jpg|jpeg|png|doc|docx|xlsx|xls|txt)$/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed. Use PDF, JPG, PNG, DOC, DOCX, XLSX, or TXT."));
    }
  },
});

function formatSize(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function parseDoc(row) {
  return {
    id:            row.id,
    name:          row.name,
    category:      row.category,
    fileName:      row.file_name,
    filePath:      row.file_path,
    fileSize:      row.file_size,
    uploadedDate:  row.uploaded_date,
    status:        row.status,
    applicationId: row.application_id,
    hasFile:       !!row.has_file,
  };
}

// Handler for uploading documents
async function handleUpload(req, res) {
  const docName = (req.body.docName || req.body.name || "").trim();
  const category = req.body.category || "General";
  const applicationId = req.body.applicationId || null;

  if (!docName) return res.status(400).json({ error: "Document name is required" });

  try {
    const db = await getPool();

    let docId, fileName, filePath, fileSize, hasFile;

    if (req.file) {
      docId = req.file.filename.split("_")[0];
      fileName = req.file.filename;
      filePath = req.file.path;
      fileSize = formatSize(req.file.size);
      hasFile = 1;
    } else {
      docId = generateId ? generateId("DOC") : ("DOC-" + Math.floor(100000 + Math.random() * 900000));
      fileName = `${docName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.pdf`;
      filePath = null;
      fileSize = "—";
      hasFile = 0;
    }

    const today = todayStr ? todayStr() : new Date().toISOString().split("T")[0];

    await db.execute(`
      INSERT INTO documents
        (id, user_id, name, category, file_name, file_path, file_size,
         uploaded_date, status, application_id, has_file)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'UPLOADED', ?, ?)
    `, [docId, req.user.id, docName, category, fileName, filePath,
        fileSize, today, applicationId, hasFile]);

    // If linked to application, attach to documents_attached list
    if (applicationId) {
      const [appRows] = await db.execute(
        "SELECT documents_attached FROM applications WHERE user_id = ? AND id = ?",
        [req.user.id, applicationId]
      );
      if (appRows.length > 0) {
        let attached = [];
        const raw = appRows[0].documents_attached;
        if (raw) {
          if (Array.isArray(raw)) attached = raw;
          else if (typeof raw === "object") attached = Object.values(raw);
          else {
            try { attached = JSON.parse(raw); } catch (e) { attached = []; }
          }
        }
        if (!attached.includes(docName)) {
          attached.push(docName);
          await db.execute(
            "UPDATE applications SET documents_attached = ? WHERE user_id = ? AND id = ?",
            [JSON.stringify(attached), req.user.id, applicationId]
          );
        }
      }
    }

    if (logActivity) {
      await logActivity(req.user.id, `Document uploaded: ${docName}`, "Documents");
    }

    const [rows] = await db.execute(
      "SELECT * FROM documents WHERE user_id = ? AND id = ?",
      [req.user.id, docId]
    );
    res.status(201).json(parseDoc(rows[0]));
  } catch (err) {
    console.error("[Documents POST]", err);
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    res.status(500).json({ error: err.message });
  }
}

// GET /api/documents
router.get("/", async (req, res) => {
  try {
    const db = await getPool();
    const [rows] = await db.execute(
      "SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows.map(parseDoc));
  } catch (err) {
    console.error("[Documents GET]", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/documents AND POST /api/documents/upload
router.post("/", upload.single("file"), handleUpload);
router.post("/upload", upload.single("file"), handleUpload);

// DELETE /api/documents/:id
router.delete("/:id", async (req, res) => {
  try {
    const db = await getPool();
    const [rows] = await db.execute(
      "SELECT * FROM documents WHERE user_id = ? AND id = ?",
      [req.user.id, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Document not found" });

    const doc = rows[0];
    if (doc.file_path && fs.existsSync(doc.file_path)) {
      try { fs.unlinkSync(doc.file_path); } catch (e) {}
    }

    await db.execute("DELETE FROM documents WHERE user_id = ? AND id = ?", [req.user.id, req.params.id]);
    if (logActivity) {
      await logActivity(req.user.id, `Deleted document: ${doc.name}`, "Documents");
    }

    res.json({ success: true });
  } catch (err) {
    console.error("[Documents DELETE]", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
