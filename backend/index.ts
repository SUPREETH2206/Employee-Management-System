import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import taskRoutes from "./routes/tasks";
import leaveRoutes from "./routes/leaves";
import meetingRoutes from "./routes/meetings";
import accessLogRoutes from "./routes/access-logs";
import chatRoutes from "./routes/chat";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// =======================
// API ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/access-logs", accessLogRoutes);
app.use("/api/chat", chatRoutes);

// =======================
// SERVE FRONTEND (VITE BUILD)
// =======================

const __dirnameResolved = path.resolve();
const frontendPath = path.join(__dirnameResolved, "../frontend/dist");

// Serve static files
app.use(express.static(frontendPath));

// Fallback to index.html for React Router
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next(); // don't override API routes
  }
  res.sendFile(path.join(frontendPath, "index.html"));
});

// =======================
// START SERVER
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
