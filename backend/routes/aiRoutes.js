const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Apply middleware to all AI routes
router.use(protect);
router.use(authorize("teacher"));

// Generate quiz questions
router.post("/generate-questions", aiController.generateQuestions);

// Check AI service health
router.get("/health", aiController.checkAIHealth);

module.exports = router;
