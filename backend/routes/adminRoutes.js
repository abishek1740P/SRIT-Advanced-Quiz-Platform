const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Apply admin middleware to all routes
router.use(protect, authorize(["admin"]));

// User management routes
router.get("/users", adminController.getUsers);
router.delete("/users/:userId", adminController.deleteUser);
router.get("/users/export", adminController.exportUsers);

// Teacher management routes
router.post("/teachers", adminController.addTeacher);
router.post(
  "/teachers/bulk-upload",
  upload.single("file"),
  adminController.bulkUploadTeachers
);

// Dashboard and analytics
router.get("/dashboard/stats", adminController.getDashboardStats);
router.get("/analytics", adminController.getSystemAnalytics);

module.exports = router;
