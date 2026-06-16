import { Router } from "express";
import UserShop from "../models/UserShop.js";

const router = Router();

// GET /api/shop — fetch shop data for current user
router.get("/", async (req, res) => {
  try {
    const shop = await UserShop.findOne({ userId: req.uid });

    if (!shop) {
      return res.json({
        purchasedItems: [],
        equippedItems: { tshirt: null, trousers: null },
      });
    }

    res.json({
      purchasedItems: shop.purchasedItems ?? [],
      equippedItems: shop.equippedItems ?? { tshirt: null, trousers: null },
    });
  } catch (err) {
    console.error("GET /api/shop error:", err);
    res.status(500).json({ error: "Failed to fetch shop data" });
  }
});

// PUT /api/shop — upsert shop data for current user
router.put("/", async (req, res) => {
  try {
    const { purchasedItems, equippedItems } = req.body;

    const shop = await UserShop.findOneAndUpdate(
      { userId: req.uid },
      {
        $set: {
          purchasedItems: purchasedItems ?? [],
          equippedItems: equippedItems ?? { tshirt: null, trousers: null },
        },
      },
      { upsert: true, new: true }
    );

    res.json({
      purchasedItems: shop.purchasedItems,
      equippedItems: shop.equippedItems,
    });
  } catch (err) {
    console.error("PUT /api/shop error:", err);
    res.status(500).json({ error: "Failed to update shop data" });
  }
});

export default router;
