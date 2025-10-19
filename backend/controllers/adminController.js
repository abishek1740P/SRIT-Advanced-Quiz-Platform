const User = require("../models/User");
const Quiz = require("../models/Quiz");
const QuizResponse = require("../models/Response");
const { Parser } = require("json2csv");
const csv = require("csv-parser");
const stream = require("stream");

// =========================
// 🔹 USER MANAGEMENT
// =========================

// Get users by role
const getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 50, search = "" } = req.query;

    if (!role || !["teachers", "students"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role is required and must be 'teachers' or 'students'",
      });
    }

    const userRole = role === "teachers" ? "teacher" : "student";

    // Build search query
    const searchQuery = {
      role: userRole,
      ...(search && {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }),
    };

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(searchQuery)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(searchQuery),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Handle dependent data
    if (user.role === "teacher") {
      await Quiz.updateMany({ teacher: userId }, { $set: { isActive: false } });
    } else if (user.role === "student") {
      await QuizResponse.deleteMany({ student: userId });
    }

    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: `${user.role} deleted successfully`,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// Export users to CSV
const exportUsers = async (req, res) => {
  try {
    const { role } = req.query;

    if (!role || !["teachers", "students"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role is required and must be 'teachers' or 'students'",
      });
    }

    const userRole = role === "teachers" ? "teacher" : "student";
    const users = await User.find({ role: userRole }).select("-password");

    const fields = [
      { label: "Name", value: "name" },
      { label: "Email", value: "email" },
      { label: "Role", value: "role" },
      { label: "Joined Date", value: "createdAt" },
    ];

    const json2csvParser = new Parser({ fields });
    const csvData = json2csvParser.parse(users);

    res.header("Content-Type", "text/csv");
    res.attachment(`${role}_${new Date().toISOString().split("T")[0]}.csv`);
    res.send(csvData);
  } catch (error) {
    console.error("Export users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export users",
    });
  }
};

// =========================
// 🔹 TEACHER MANAGEMENT
// =========================

// Add a new teacher
const addTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (!email.endsWith("@sritcbe.ac.in")) {
      return res.status(400).json({
        success: false,
        message: "Only @sritcbe.ac.in emails are allowed",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Teacher with this email already exists",
      });
    }

    const teacher = await User.create({
      name,
      email,
      password,
      role: "teacher",
    });

    const teacherResponse = teacher.toObject();
    delete teacherResponse.password;

    res.status(201).json({
      success: true,
      data: teacherResponse,
      message: "Teacher added successfully",
    });
  } catch (error) {
    console.error("Add teacher error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add teacher",
    });
  }
};

// Bulk upload teachers from CSV
const bulkUploadTeachers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    const results = [];
    const errors = [];
    let successCount = 0;
    let failedCount = 0;

    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    await new Promise((resolve, reject) => {
      bufferStream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", resolve)
        .on("error", reject);
    });

    for (const [index, row] of results.entries()) {
      try {
        const { name, email, password } = row;

        if (!name || !email || !password) {
          errors.push(`Row ${index + 2}: Missing required fields`);
          failedCount++;
          continue;
        }

        if (!email.endsWith("@sritcbe.ac.in")) {
          errors.push(`Row ${index + 2}: Invalid email domain - ${email}`);
          failedCount++;
          continue;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          errors.push(`Row ${index + 2}: Email already exists - ${email}`);
          failedCount++;
          continue;
        }

        await User.create({ name, email, password, role: "teacher" });
        successCount++;
      } catch (error) {
        errors.push(`Row ${index + 2}: ${error.message}`);
        failedCount++;
      }
    }

    res.json({
      success: true,
      data: {
        success: successCount,
        failed: failedCount,
        errors: errors.slice(0, 10),
      },
      message: `Bulk upload completed. Success: ${successCount}, Failed: ${failedCount}`,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process CSV file",
    });
  }
};

// =========================
// 🔹 DASHBOARD & ANALYTICS
// =========================

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const [totalTeachers, totalStudents, totalQuizzes, activeQuizzes] =
      await Promise.all([
        User.countDocuments({ role: "teacher" }),
        User.countDocuments({ role: "student" }),
        Quiz.countDocuments(),
        Quiz.countDocuments({ isActive: true }),
      ]);

    const recentQuizzes = await Quiz.find()
      .populate("teacher", "name email")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title teacher createdAt");

    const recentActivity = recentQuizzes.map((quiz) => ({
      id: quiz._id,
      action: "Quiz Created",
      user: quiz.teacher?.name || "Unknown",
      timestamp: quiz.createdAt,
    }));

    res.json({
      success: true,
      data: {
        totalTeachers,
        totalStudents,
        totalQuizzes,
        activeQuizzes,
        recentActivity,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

// Get system analytics
const getSystemAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [quizzesLast30Days, responsesLast30Days, topTeachers] =
      await Promise.all([
        Quiz.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        QuizResponse.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        User.aggregate([
          { $match: { role: "teacher" } },
          {
            $lookup: {
              from: "quizzes",
              localField: "_id",
              foreignField: "teacher",
              as: "quizzes",
            },
          },
          {
            $project: {
              name: 1,
              email: 1,
              quizCount: { $size: "$quizzes" },
            },
          },
          { $sort: { quizCount: -1 } },
          { $limit: 5 },
        ]),
      ]);

    res.json({
      success: true,
      data: {
        quizzesLast30Days,
        responsesLast30Days,
        topTeachers,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("System analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch system analytics",
    });
  }
};

// =========================
// 🔹 EXPORTS
// =========================

module.exports = {
  getUsers,
  addTeacher,
  deleteUser,
  bulkUploadTeachers,
  exportUsers,
  getDashboardStats,
  getSystemAnalytics,
};
