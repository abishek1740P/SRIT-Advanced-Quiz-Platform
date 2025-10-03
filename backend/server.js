// server.js (main file)
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Route imports
const userRoutes = require("./routes/userRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes); // Make sure this is included

app.get("/", (req, res) => res.send("Secure Quiz Platform API running"));

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);

  socket.on("joinQuizRoom", (quizId) => {
    socket.join(quizId);
    console.log(`Socket ${socket.id} joined quiz ${quizId}`);
  });

  socket.on("startTimer", ({ quizId, duration }) => {
    io.to(quizId).emit("timerUpdate", { duration });
  });

  socket.on("logViolation", ({ quizId, studentId }) => {
    io.to(quizId).emit("violation", { studentId });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
