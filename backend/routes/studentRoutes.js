// routes/studentRoutes.js
const express = require("express");
const {
  joinQuiz,
  submitQuiz,
  getStudentQuizzes,
} = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

// Apply middleware to all routes
router.use(protect);
router.use(authorize("student"));

router.post("/join", joinQuiz);
router.post("/:quizId/submit", submitQuiz);
router.get("/quizzes", getStudentQuizzes);

module.exports = router;
