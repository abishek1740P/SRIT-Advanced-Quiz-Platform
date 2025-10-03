const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: [
    {
      questionIndex: Number,
      selectedAnswer: Number,
      isCorrect: Boolean,
      timeTaken: Number, // in seconds
    },
  ],
  score: {
    type: Number,
    default: 0,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  violations: {
    type: Number,
    default: 0,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["in-progress", "completed", "submitted"],
    default: "in-progress",
  },
});

responseSchema.index({ quiz: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Response", responseSchema);
