require("dotenv").config();

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const classRoutes = require("./routes/classRoutes");
const sectionRoutes = require("./routes/sectionRoutes");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", authRoutes);
app.use("/", classRoutes);
app.use("/", sectionRoutes);

const PORT = 5000;

pool.connect()
    .then(() => {
        console.log("Connected to PostgreSQL");
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});