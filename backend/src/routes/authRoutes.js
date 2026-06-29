const express = require("express");

const router = express.Router();

const { registerSchool } = require("../controllers/authController");

router.post("/register", registerSchool);

module.exports = router;