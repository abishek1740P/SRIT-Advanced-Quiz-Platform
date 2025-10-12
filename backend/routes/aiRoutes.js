const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { aiLimiter, strictLimiter } = require("../middleware/rateLimiter");

// Apply middleware to all AI routes
router.use(protect);
router.use(authorize("teacher"));

// Generate quiz questions with AI-specific rate limiting
router.post("/generate-questions", aiLimiter, aiController.generateQuestions);

// Check AI service health with strict rate limiting
router.get("/health", strictLimiter, aiController.checkAIHealth);

module.exports = router;
