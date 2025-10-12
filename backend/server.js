// backend/server.js
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app"); // Import the Express app

dotenv.config();

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*", // Allow frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io events
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("joinQuizRoom", (quizId) => {
    socket.join(quizId);
    console.log(`📘 Socket ${socket.id} joined quiz room ${quizId}`);
  });

  socket.on("startTimer", ({ quizId, duration }) => {
    io.to(quizId).emit("timerUpdate", { duration });
  });

  socket.on("logViolation", ({ quizId, studentId }) => {
    io.to(quizId).emit("violation", { studentId });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
