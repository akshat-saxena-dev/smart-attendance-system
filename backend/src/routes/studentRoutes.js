const express = require("express");
const router = express.Router();

const {
  addStudents,
  getStudents,
  deleteStudents,
  addStudent,
} = require("../controllers/studentController");

router.post("/sections/:sectionId/students", addStudents);
router.get("/sections/:sectionId/students", getStudents);
router.delete("/sections/:sectionId/students", deleteStudents);
router.post("/sections/:sectionId/student", addStudent);

module.exports = router;
