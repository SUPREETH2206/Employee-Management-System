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

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/access-logs", accessLogRoutes);
// If you have meetingRoutes etc. keep them as you already have
app.use("/api/chat", chatRoutes);

// Serve Frontend (ONE place only)
const __dirnameResolved = path.resolve();
app.use(express.static(path.join(__dirnameResolved, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirnameResolved, "../frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
