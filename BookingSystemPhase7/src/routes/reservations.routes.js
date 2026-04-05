import express from "express";
import pool from "../db/pool.js";
import { logEvent } from "../services/log.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

/* =====================================================
   CREATE
   POST /api/reservations
===================================================== */
router.post("/", requireAuth, async (req, res) => {
  const actorUserId = req.user.id; // JWT:stä
  const {
    resourceId,
    startTime,
    endTime,
    note,
    status
  } = req.body;

  try {
    const insertSql = `
      INSERT INTO reservations
      (resource_id, user_id, start_time, end_time, note, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const params = [
      Number(resourceId),
      actorUserId,  // vain kirjautuneen käyttäjän varaus
      startTime,
      endTime,
      note || null,
      status || "active"
    ];

    const { rows } = await pool.query(insertSql, params);

    await logEvent({
      actorUserId,
      action: "reserve",
      message: `Reservation created (ID ${rows[0].id})`,
      entityType: "reservation",
      entityId: rows[0].id,
    });

    return res.status(201).json({ ok: true, data: rows[0] });

  } catch (err) {
    console.error("DB insert failed:", err);
    return res.status(500).json({ ok: false, error: "Database error" });
  }
});

/* =====================================================
   READ ALL (only own reservations)
   GET /api/reservations
===================================================== */
router.get("/", requireAuth, async (req, res) => {
  try {
    const sql = `
      SELECT
        r.*,
        u.email AS user_email,
        res.name AS resource_name
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN resources res ON r.resource_id = res.id
      WHERE r.user_id = $1
      ORDER BY r.start_time DESC
    `;

    const { rows } = await pool.query(sql, [req.user.id]);
    return res.status(200).json({ ok: true, data: rows });

  } catch (err) {
    console.error("READ ALL failed:", err);
    return res.status(500).json({ ok: false, error: "Database error" });
  }
});

/* =====================================================
   READ ONE (only own reservation)
   GET /api/reservations/:id
===================================================== */
router.get("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ ok: false, error: "Invalid ID" });

  try {
    const sql = `
      SELECT r.*, u.email AS user_email, res.name AS resource_name
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN resources res ON r.resource_id = res.id
      WHERE r.id = $1 AND r.user_id = $2
    `;
    const { rows } = await pool.query(sql, [id, req.user.id]);

    if (rows.length === 0) return res.status(404).json({ ok: false, error: "Reservation not found" });

    return res.status(200).json({ ok: true, data: rows[0] });

  } catch (err) {
    console.error("READ ONE failed:", err);
    return res.status(500).json({ ok: false, error: "Database error" });
  }
});

/* =====================================================
   UPDATE (only own reservation)
   PUT /api/reservations/:id
===================================================== */
router.put("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ ok: false, error: "Invalid ID" });

  const actorUserId = req.user.id;
  const { resourceId, startTime, endTime, note, status } = req.body;

  try {
    const sql = `
      UPDATE reservations
      SET resource_id = $1,
          start_time = $2,
          end_time = $3,
          note = $4,
          status = $5
      WHERE id = $6 AND user_id = $7
      RETURNING *
    `;
    const params = [Number(resourceId), startTime, endTime, note || null, status || "active", id, actorUserId];
    const { rows } = await pool.query(sql, params);

    if (rows.length === 0) return res.status(404).json({ ok: false, error: "Reservation not found" });

    await logEvent({
      actorUserId,
      action: "reserve",
      message: `Reservation updated (ID ${id})`,
      entityType: "reservation",
      entityId: id,
    });

    return res.status(200).json({ ok: true, data: rows[0] });

  } catch (err) {
    console.error("UPDATE failed:", err);
    return res.status(500).json({ ok: false, error: "Database error" });
  }
});

/* =====================================================
   DELETE (only own reservation)
   DELETE /api/reservations/:id
===================================================== */
router.delete("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ ok: false, error: "Invalid ID" });

  const actorUserId = req.user.id;

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM reservations WHERE id = $1 AND user_id = $2",
      [id, actorUserId]
    );

    if (rowCount === 0) return res.status(404).json({ ok: false, error: "Reservation not found" });

    await logEvent({
      actorUserId,
      action: "reserve",
      message: `Reservation deleted (ID ${id})`,
      entityType: "reservation",
      entityId: id,
    });

    return res.status(204).send();

  } catch (err) {
    console.error("DELETE failed:", err);
    return res.status(500).json({ ok: false, error: "Database error" });
  }
});

export default router;