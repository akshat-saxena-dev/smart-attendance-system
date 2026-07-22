const express = require("express");
const router = express.Router();

const { addStudents, getStudents } = require("../controllers/studentController");

router.post("/sections/:sectionId/students", addStudents);
router.get("/sections/:sectionId/students", getStudents);

module.exports = router;