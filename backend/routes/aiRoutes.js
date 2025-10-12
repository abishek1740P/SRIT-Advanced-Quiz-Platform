const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Apply middleware to all AI routes
router.use(protect);
router.use(authorize("teacher"));

// Generate quiz questions (protected - teachers only)
router.post("/generate-questions", aiController.generateQuestions);

// Check AI service health (protected - teachers only)
router.get("/health", aiController.checkAIHealth);

module.exports = router;
