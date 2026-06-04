import { Router } from "express";
import pool from "../db.js";

const router = Router();

// GET /api/progress — fetch user progress
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM user_progress WHERE id = 1");

    if (rows.length === 0) {
      return res.json({ xp: 0, crystals: 0, streak: 0, lastCompletedDate: null });
    }

    const row = rows[0];
    res.json({
      xp: row.xp,
      crystals: row.crystals,
      streak: row.streak,
      lastCompletedDate: row.last_completed_date
        ? (row.last_completed_date instanceof Date
            ? row.last_completed_date.toISOString().split("T")[0]
            : row.last_completed_date)
        : null,
    });
  } catch (err) {
    console.error("GET /api/progress error:", err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// PUT /api/progress — update user progress
router.put("/", async (req, res) => {
  try {
    const { xp, crystals, streak, lastCompletedDate } = req.body;

    await pool.query(
      `UPDATE user_progress
       SET xp = ?, crystals = ?, streak = ?, last_completed_date = ?
       WHERE id = 1`,
      [xp ?? 0, crystals ?? 0, streak ?? 0, lastCompletedDate || null]
    );

    res.json({ xp, crystals, streak, lastCompletedDate });
  } catch (err) {
    console.error("PUT /api/progress error:", err);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

export default router;
