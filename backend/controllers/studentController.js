// controllers/studentController.js
const Quiz = require("../models/Quiz");
const Response = require("../models/Response");

const joinQuiz = async (req, res) => {
  try {
    const { secretCode } = req.body;
    

    // Find quiz by secret code and check if it's active
    const quiz = await Quiz.findOne({
      secretCode: secretCode.toUpperCase().trim(),
      isActive: true,
    }).populate("teacher", "name");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found or inactive",
      });
    }

    // Check if student already attempted
    const existingResponse = await Response.findOne({
      quiz: quiz._id,
      student: req.user._id,
    });

    if (existingResponse) {
      return res.status(400).json({
        success: false,
        message: "You have already attempted this quiz",
      });
    }

    res.json({
      success: true,
      data: quiz,
    });
  } catch (error) {
   
    res.status(500).json({
      success: false,
      message: "Error joining quiz",
      error: error.message,
    });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers, violations = 0 } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    let score = 0;
    const detailedAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = question.correctAnswer === answer.selectedAnswer;

      if (isCorrect) {
        score += question.points;
      }

      return {
        questionIndex: index,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        timeTaken: answer.timeTaken || 0,
      };
    });

    const response = await Response.create({
      quiz: quizId,
      student: req.user._id,
      answers: detailedAnswers,
      score,
      violations,
      totalPoints: quiz.questions.reduce((sum, q) => sum + q.points, 0),
      startTime: new Date(),
      endTime: new Date(),
      status: "completed",
    });

    // Populate the response with quiz data for the frontend
    await response.populate("quiz", "title duration description");

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting quiz",
      error: error.message,
    });
  }
};

// controllers/studentController.js - Updated getStudentQuizzes
const getStudentQuizzes = async (req, res) => {
  try {
    const responses = await Response.find({ student: req.user._id })
      .populate({
        path: "quiz",
        select: "title duration description teacher questions createdAt",
        populate: {
          path: "teacher",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    // Process responses to include complete question data
    const processedResponses = responses.map((response) => {
      const responseObj = response.toObject();

      // Get the quiz questions
      const quizQuestions = responseObj.quiz?.questions || [];

      // Map answers with complete question data
      responseObj.detailedAnswers = responseObj.answers.map((answer) => {
        const question = quizQuestions[answer.questionIndex];

        if (question) {
          return {
            ...answer,
            questionText: question.questionText,
            choices: question.choices,
            points: question.points,
            correctAnswer: question.correctAnswer,
          };
        } else {
          // Fallback if question data is missing
          return {
            ...answer,
            questionText: `Question ${answer.questionIndex + 1}`,
            choices: ["Option A", "Option B", "Option C", "Option D"],
            points: 5,
            correctAnswer: 0, // Default to first option
          };
        }
      });

      return responseObj;
    });

    res.json({
      success: true,
      data: processedResponses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching student quizzes",
      error: error.message,
    });
  }
};

module.exports = { joinQuiz, submitQuiz, getStudentQuizzes };
