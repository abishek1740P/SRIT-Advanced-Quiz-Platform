// backend/app.js
const express = require("express");
const cors = require("cors");
const { json } = require("express");

// Route imports
const userRoutes = require("./routes/userRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const aiRoutes = require("./routes/aiRoutes"); // Gemini or AI route

const app = express();

// Middleware
app.use(cors());
app.use(json());

// API routes
app.use("/api/users", userRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Quiz API is running",
    timestamp: new Date().toISOString(),
  });
});

// Default route
app.get("/", (req, res) => res.send("Secure Quiz Platform API running"));

module.exports = app;
