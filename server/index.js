import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import tasksRouter from "./routes/tasks.js";
import progressRouter from "./routes/progress.js";
import shopRouter from "./routes/shop.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", tasksRouter);
app.use("/api/progress", progressRouter);
app.use("/api/shop", shopRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Gamified Todo API running on http://localhost:${PORT}`);
});
