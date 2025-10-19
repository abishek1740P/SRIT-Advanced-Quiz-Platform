const express = require("express");
const {
  joinQuiz,
  submitQuiz,
  getStudentQuizzes,
} = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authMiddleware");
const { quizSubmissionLimiter, userLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Apply middleware to all routes
router.use(protect);
router.use(authorize("student"));
router.use(userLimiter); // Apply user-specific rate limiting

// Specific rate limiting for quiz submissions
router.post("/join", joinQuiz);
router.post("/:quizId/submit", quizSubmissionLimiter, submitQuiz);
router.get("/quizzes", getStudentQuizzes);

module.exports = router;