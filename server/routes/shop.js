import { Router } from "express";
import pool from "../db.js";

const router = Router();

// GET /api/shop — fetch purchased and equipped items
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM user_shop WHERE id = 1");

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

// PUT /api/shop — update purchased and equipped items
router.put("/", async (req, res) => {
  try {
    const { purchasedItems, equippedItems } = req.body;

    await pool.query(
      `UPDATE user_shop
       SET purchased_items = ?, equipped_items = ?
       WHERE id = 1`,
      [
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
