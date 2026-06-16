import { Router } from "express";
import Task from "../models/Task.js";

const router = Router();

// Helper — format a Task doc for the frontend
function formatTask(doc) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    date: doc.date,
    time: doc.time,
    reminders: doc.reminders ?? [],
    difficulty: doc.difficulty,
    completed: doc.completed,
  };
}

// GET /api/tasks — all tasks for current user
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.uid }).sort({
      completed: 1,
      date: 1,
      time: 1,
    });
    res.json(tasks.map(formatTask));
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST /api/tasks — create a new task
router.post("/", async (req, res) => {
  try {
    const { title, date, time, reminders = [], difficulty = "easy" } = req.body;

    if (!title || !date || !time) {
      return res.status(400).json({ error: "title, date and time are required" });
    }

    const task = await Task.create({
      userId: req.uid,
      title,
      date,
      time,
      reminders,
      difficulty,
    });

    res.status(201).json(formatTask(task));
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT /api/tasks/:id — update a task (owner only)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = ["title", "date", "time", "reminders", "difficulty", "completed"];
    const updates = {};

    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.uid },
      updates,
      { new: true }
    );

    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(formatTask(task));
  } catch (err) {
    console.error("PUT /api/tasks/:id error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE /api/tasks/:id — delete a task (owner only)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Task.findOneAndDelete({ _id: id, userId: req.uid });

    if (!result) return res.status(404).json({ error: "Task not found" });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/tasks/:id error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
