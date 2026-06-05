import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { readFileSync } from "fs";

import tasksRouter from "./routes/tasks.js";
import progressRouter from "./routes/progress.js";
import shopRouter from "./routes/shop.js";
import { verifyToken } from "./middleware/auth.js";

dotenv.config();

// ── Initialize Firebase Admin ─────────────────────────────────────────────────
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccountPath) {
  console.error("❌ GOOGLE_APPLICATION_CREDENTIALS not set in .env");
  process.exit(1);
}

try {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin initialized");
} catch (err) {
  console.error("❌ Failed to initialize Firebase Admin:", err.message);
  process.exit(1);
}

// ── Express App ───────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// All /api routes are protected by Firebase auth
app.use("/api", verifyToken);

// Routes
app.use("/api/tasks", tasksRouter);
app.use("/api/progress", progressRouter);
app.use("/api/shop", shopRouter);

// Health check (public)
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Gamified Todo API running on http://localhost:${PORT}`);
});
