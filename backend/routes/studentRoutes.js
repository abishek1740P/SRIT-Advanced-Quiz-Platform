const express = require("express");
const {
  joinQuiz,
  submitQuiz,
  getStudentQuizzes,
} = require("../controllers/studentController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply middleware to all routes
router.use(protect);
router.use(authorize("student"));

// Routes
router.post("/join", joinQuiz);
router.post("/:quizId/submit", submitQuiz);
router.get("/quizzes", getStudentQuizzes);

module.exports = router;