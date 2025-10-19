const express = require("express");
const cors = require("cors");
const { json } = require("express");

// Rate limiting middleware
const { apiLimiter, authLimiter } = require("./middleware/rateLimiter");

// Route imports
const userRoutes = require("./routes/userRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminRoutes = require("./routes/adminRoutes"); // Add this line

const app = express();

// Middleware
app.use(cors());
app.use(json());

// ==================== RATE LIMITING CONFIGURATION ====================

// Global API rate limiting (applied to all /api routes)
app.use("/api/", apiLimiter);

// Stricter rate limiting for authentication endpoints
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

// ==================== API ROUTES ====================

app.use("/api/users", userRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes); // Add this line

// ==================== HEALTH CHECK (with rate limiting) ====================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Quiz API is running",
    timestamp: new Date().toISOString(),
  });
});

// ==================== DEFAULT ROUTE ====================

app.get("/", (req, res) => res.send("Secure Quiz Platform API running"));

module.exports = app;
