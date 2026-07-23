const express = require("express");
const router = express.Router();

const { addStudents, getStudents, deleteStudents } = require("../controllers/studentController");

router.post("/sections/:sectionId/students", addStudents);
router.get("/sections/:sectionId/students", getStudents);
router.delete("/sections/:sectionId/students", deleteStudents);

module.exports = router;