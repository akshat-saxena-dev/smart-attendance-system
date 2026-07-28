const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const {
  addStudents,
  getStudents,
  deleteStudents,
  deleteStudent,
  addStudent,
  uploadStudentsOCR
} = require("../controllers/studentController");

router.post("/sections/:sectionId/students", addStudents);
router.get("/sections/:sectionId/students", getStudents);
router.delete("/sections/:sectionId/students", deleteStudents);
router.post("/sections/:sectionId/student", addStudent);
router.delete("/student/:studentId", deleteStudent);
router.post("/ocr", upload.single("image"), uploadStudentsOCR);

module.exports = router;
