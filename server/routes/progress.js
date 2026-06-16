import { Router } from "express";
import UserProgress from "../models/UserProgress.js";

const router = Router();

// GET /api/progress — fetch progress for current user
router.get("/", async (req, res) => {
  try {
    const progress = await UserProgress.findOne({ userId: req.uid });

    if (!progress) {
      return res.json({ xp: 0, crystals: 0, streak: 0, lastCompletedDate: null });
    }

    res.json({
      xp: progress.xp,
      crystals: progress.crystals,
      streak: progress.streak,
      lastCompletedDate: progress.lastCompletedDate ?? null,
    });
  } catch (err) {
    console.error("GET /api/progress error:", err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// PUT /api/progress — upsert progress for current user
router.put("/", async (req, res) => {
  try {
    const { xp, crystals, streak, lastCompletedDate } = req.body;

    const progress = await UserProgress.findOneAndUpdate(
      { userId: req.uid },
      {
        $set: {
          xp: xp ?? 0,
          crystals: crystals ?? 0,
          streak: streak ?? 0,
          lastCompletedDate: lastCompletedDate || null,
        },
      },
      { upsert: true, new: true }
    );

    res.json({
      xp: progress.xp,
      crystals: progress.crystals,
      streak: progress.streak,
      lastCompletedDate: progress.lastCompletedDate ?? null,
    });
  } catch (err) {
    console.error("PUT /api/progress error:", err);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

export default router;
