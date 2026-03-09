const express = require("express");
const { register, login, getMe } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.use(protect); // JWT authentication

router.get("/me", getMe);

module.exports = router;