import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { connectDB } from "./db.js";

import tasksRouter from "./routes/tasks.js";
import progressRouter from "./routes/progress.js";
import shopRouter from "./routes/shop.js";
import { verifyToken } from "./middleware/auth.js";

dotenv.config();

// ── Initialize Firebase Admin ─────────────────────────────────────────────────
// Supports both a JSON string env var (for Render/cloud) and a file path (local dev)
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  // Cloud deployment — JSON stored as env var string
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  // Local dev — JSON file path
  const { readFileSync } = await import("fs");
  serviceAccount = JSON.parse(
    readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf-8")
  );
} else {
  console.error("❌ No Firebase credentials found. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS");
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
console.log("✅ Firebase Admin initialized");

// ── Connect to MongoDB ────────────────────────────────────────────────────────
await connectDB();

// ── Express App ───────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL, // set to your Vercel URL in production
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (e.g. mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

// All /api routes are protected
app.use("/api", verifyToken);
app.use("/api/tasks", tasksRouter);
app.use("/api/progress", progressRouter);
app.use("/api/shop", shopRouter);

// Health / root check (public)
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "gamified-todo-api" });
});
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Gamified Todo API running on http://localhost:${PORT}`);
});
