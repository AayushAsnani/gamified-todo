import { Router } from "express";
import pool from "../db.js";

const router = Router();

// GET /api/shop — fetch shop data for the current user
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM user_shop WHERE user_id = ?",
      [req.uid]
    );

    if (rows.length === 0) {
      return res.json({
        purchasedItems: [],
        equippedItems: { tshirt: null, trousers: null },
      });
    }

    const row = rows[0];
    res.json({
      purchasedItems: row.purchased_items ?? [],
      equippedItems: row.equipped_items ?? { tshirt: null, trousers: null },
    });
  } catch (err) {
    console.error("GET /api/shop error:", err);
    res.status(500).json({ error: "Failed to fetch shop data" });
  }
});

// PUT /api/shop — upsert shop data for the current user
router.put("/", async (req, res) => {
  try {
    const { purchasedItems, equippedItems } = req.body;

    await pool.query(
      `INSERT INTO user_shop (user_id, purchased_items, equipped_items)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         purchased_items = VALUES(purchased_items),
         equipped_items = VALUES(equipped_items)`,
      [
        req.uid,
        JSON.stringify(purchasedItems ?? []),
        JSON.stringify(equippedItems ?? { tshirt: null, trousers: null }),
      ]
    );

    res.json({ purchasedItems, equippedItems });
  } catch (err) {
    console.error("PUT /api/shop error:", err);
    res.status(500).json({ error: "Failed to update shop data" });
  }
});

export default router;
