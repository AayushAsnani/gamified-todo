import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    xp: { type: Number, default: 0 },
    crystals: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastCompletedDate: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("UserProgress", userProgressSchema);
