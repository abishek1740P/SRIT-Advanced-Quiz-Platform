const express = require("express");
const cors = require("cors");
const { json } = require("express");

// Route imports
const userRoutes = require("./routes/userRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(json());

// ==================== API ROUTES ====================

app.use("/api/users", userRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);

// ==================== HEALTH CHECK ====================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Quiz API is running",
    timestamp: new Date().toISOString(),
  });
});

// ==================== DEFAULT ROUTE ====================

app.get("/", (req, res) => res.send("Quiz Platform API running"));

module.exports = app;
