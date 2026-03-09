const express = require("express");
const {
  createQuiz,
  getTeacherQuizzes,
  getQuizAnalytics,
  getDashboardStats,
  toggleQuizStatus,
  getQuizStatus,
} = require("../controllers/teacherController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply middleware to all routes
router.use(protect);
router.use(authorize("teacher"));

// Quiz CRUD routes
router.post("/quizzes", createQuiz);
router.get("/quizzes", getTeacherQuizzes);

// Dashboard and analytics routes
router.get("/dashboard/stats", getDashboardStats);
router.get("/quizzes/:quizId/analytics", getQuizAnalytics);
router.patch("/quizzes/:quizId/status", toggleQuizStatus);
router.get("/quizzes/:quizId/status", getQuizStatus);

module.exports = router;