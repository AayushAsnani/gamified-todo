import { Router } from "express";
import pool from "../db.js";

const router = Router();

// GET /api/tasks — fetch all tasks for the current user
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, date, time, reminders, difficulty, completed, created_at FROM tasks WHERE user_id = ? ORDER BY completed ASC, CONCAT(date, ' ', time) ASC",
      [req.uid]
    );

    const tasks = rows.map((row) => ({
      id: row.id,
      title: row.title,
      date: row.date instanceof Date
        ? row.date.toISOString().split("T")[0]
        : row.date,
      time: typeof row.time === "string" ? row.time.slice(0, 5) : row.time,
      reminders: row.reminders ?? [],
      difficulty: row.difficulty,
      completed: !!row.completed,
    }));

    res.json(tasks);
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST /api/tasks — create a new task for the current user
router.post("/", async (req, res) => {
  try {
    const { title, date, time, reminders = [], difficulty = "easy" } = req.body;

    if (!title || !date || !time) {
      return res.status(400).json({ error: "title, date and time are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO tasks (user_id, title, date, time, reminders, difficulty) VALUES (?, ?, ?, ?, ?, ?)",
      [req.uid, title, date, time, JSON.stringify(reminders), difficulty]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      date,
      time,
      reminders,
      difficulty,
      completed: false,
    });
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT /api/tasks/:id — update a task (only the owner can update)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    const allowed = ["title", "date", "time", "reminders", "difficulty", "completed"];
    const updates = [];
    const values = [];

    for (const key of allowed) {
      if (key in fields) {
        updates.push(`${key} = ?`);
        values.push(key === "reminders" ? JSON.stringify(fields[key]) : fields[key]);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    values.push(id, req.uid);
    const [result] = await pool.query(
      `UPDATE tasks SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ? AND user_id = ?", [id, req.uid]);
    const row = rows[0];
    res.json({
      id: row.id,
      title: row.title,
      date: row.date instanceof Date
        ? row.date.toISOString().split("T")[0]
        : row.date,
      time: typeof row.time === "string" ? row.time.slice(0, 5) : row.time,
      reminders: row.reminders ?? [],
      difficulty: row.difficulty,
      completed: !!row.completed,
    });
  } catch (err) {
    console.error("PUT /api/tasks/:id error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE /api/tasks/:id — delete a task (only the owner can delete)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [id, req.uid]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/tasks/:id error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
