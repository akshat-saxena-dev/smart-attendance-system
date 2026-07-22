require("dotenv").config();

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const classRoutes = require("./routes/classRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const studentRoutes = require("./routes/studentRoutes");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", authRoutes);
app.use("/", classRoutes);
app.use("/", sectionRoutes);
app.use("/", studentRoutes);

const PORT = 5000;

pool.connect()
  .then((client) => {
    console.log("Connected to PostgreSQL");
    client.release(); // Release the client back to the pool
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});