require("dotenv").config();

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", authRoutes);


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