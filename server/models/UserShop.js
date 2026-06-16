import mongoose from "mongoose";

const userShopSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    purchasedItems: { type: [String], default: [] },
    equippedItems: {
      type: Object,
      default: { tshirt: null, trousers: null },
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserShop", userShopSchema);
