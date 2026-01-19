// src/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";

import authRoutes from "./routes/auth";
import employeeRoutes from "./routes/employees";
import taskRoutes from "./routes/tasks";
import CommnetRoutes from "./routes/Comment";
import ProjectManagerRoutes from "./routes/ProjectManager";
import messageRoutes from "./routes/messages";

import { initSocket } from "./socket";

const app = express();

/* ✅ BODY PARSERS — MUST BE FIRST */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ✅ CORS */
app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* ✅ SECURITY HEADERS */
app.use((req, res, next) => {
  res.removeHeader("X-Frame-Options");
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' http://localhost:8082"
  );
  res.setHeader("Permissions-Policy", "geolocation=(self)");
  next();
});

/* ✅ ROUTES */
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", CommnetRoutes);
app.use("/api/projectManager", ProjectManagerRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

/* ✅ CREATE HTTP SERVER */
const server = http.createServer(app);

/* ✅ INIT SOCKET.IO */
initSocket(server);

/* ✅ SINGLE LISTEN */
const PORT = Number(process.env.PORT) || 4000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API + Socket.IO running on :${PORT}`);
});
