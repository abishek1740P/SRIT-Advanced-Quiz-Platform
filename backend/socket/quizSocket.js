const socketIO = require("socket.io");

const quizSocket = (server) => {
    const io = new socketIO.Server(server, {
        cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
        console.log("New client connected: " + socket.id);

        socket.on("startTimer", ({ quizId, duration }) => {
            io.to(quizId).emit("timerUpdate", { duration });
        });

        socket.on("logViolation", ({ quizId, studentId }) => {
            io.to(quizId).emit("violation", { studentId });
        });

        socket.on("joinQuizRoom", (quizId) => socket.join(quizId));

        socket.on("disconnect", () => console.log("Client disconnected: " + socket.id));
    });
};

module.exports = quizSocket;
