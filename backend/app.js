const express = require("express");
const cors = require("cors");
const { json } = require("express");

const userRoutes = require("./routes/userRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(cors());
app.use(json());

app.use("/api/users", userRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);

app.get("/", (req, res) => res.send("Secure Quiz Platform API running"));

module.exports = app;
