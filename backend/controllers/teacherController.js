const Quiz = require("../models/Quiz");
const Response = require("../models/Response");
const { generateSecretCode } = require("../utils/generateSecretCode");

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, duration, questions } = req.body;

    const secretCode = await generateSecretCode();

    const quiz = new Quiz({
      title,
      description,
      duration,
      questions,
      teacher: req.user.id,
      secretCode,
      isActive: true, // Default active
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating quiz",
      error: error.message,
    });
  }
};

// Get all quizzes for a teacher
exports.getTeacherQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ teacher: req.user.id })
      .sort({ createdAt: -1 })
      .populate("teacher", "name email");

    res.json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching quizzes",
      error: error.message,
    });
  }
};

// Get quiz analytics
exports.getQuizAnalytics = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Only quiz owner can access
    if (quiz.teacher.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const responses = await Response.find({ quiz: quizId })
      .populate("student", "name email")
      .sort({ score: -1 });

    // Calculate total possible points
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    // Calculate average score percentage
    const avgScorePercentage =
      responses.length > 0
        ? Math.round(
            (responses.reduce((sum, r) => sum + r.score, 0) /
              responses.length /
              totalPoints) *
              100
          )
        : 0;

    const analytics = {
      quiz: {
        id: quiz._id,
        title: quiz.title,
        totalQuestions: quiz.questions.length,
        totalPoints: totalPoints,
        isActive: quiz.isActive,
      },
      summary: {
        totalStudents: responses.length,
        avgScore: avgScorePercentage, // Now as percentage
        avgViolations:
          responses.length > 0
            ? Math.round(
                responses.reduce((sum, r) => sum + r.violations, 0) /
                  responses.length
              )
            : 0,
      },
      students: responses.map((response) => ({
        name: response.student.name,
        email: response.student.email,
        score: response.score, // Actual score
        totalPoints: totalPoints, // Max possible score
        scorePercentage: Math.round((response.score / totalPoints) * 100), // Percentage
        violations: response.violations,
        timeTaken: Math.round((response.endTime - response.startTime) / 60000), // minutes
        status: response.status,
      })),
    };

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching analytics",
      error: error.message,
    });
  }
};

// Get teacher dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const totalQuizzes = await Quiz.countDocuments({ teacher: teacherId });
    const totalResponses = await Response.countDocuments({
      quiz: { $in: await Quiz.find({ teacher: teacherId }).distinct("_id") },
    });

    const recentQuizzes = await Quiz.find({ teacher: teacherId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt secretCode isActive")
      .populate("teacher", "name email");

    const quizzesWithStats = await Promise.all(
      recentQuizzes.map(async (quiz) => {
        const responses = await Response.find({ quiz: quiz._id });
        const avgScore =
          responses.length > 0
            ? responses.reduce((sum, r) => sum + r.score, 0) / responses.length
            : 0;

        return {
          id: quiz._id,
          title: quiz.title,
          date: quiz.createdAt,
          students: responses.length,
          avgScore: Math.round(avgScore),
          status: "completed",
          secretCode: quiz.secretCode,
          isActive: quiz.isActive,
        };
      })
    );

    res.json({
      success: true,
      data: {
        stats: [
          {
            label: "Total Quizzes",
            value: totalQuizzes.toString(),
          },
          {
            label: "Total Students",
            value: totalResponses.toString(),
          },
        ],
        recentQuizzes: quizzesWithStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};

// Toggle quiz active status
exports.toggleQuizStatus = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { isActive } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.teacher.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    quiz.isActive = isActive;
    await quiz.save();

    res.json({
      success: true,
      message: `Quiz ${isActive ? "enabled" : "disabled"} successfully`,
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating quiz status",
      error: error.message,
    });
  }
};

// Get quiz status
exports.getQuizStatus = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.teacher.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: {
        isActive: quiz.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching quiz status",
      error: error.message,
    });
  }
};
