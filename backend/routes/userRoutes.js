const express = require("express");
const { register, login, getMe } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter, registerLimiter, apiLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Public routes with specific rate limiting
router.post("/register", registerLimiter, register);
router.post("/login", authLimiter, login);

// Protected routes with general rate limiting
router.use(protect); // JWT authentication first
// router.use(apiLimiter); // Then apply rate limiting

router.get("/me", getMe);

module.exports = router;