const express = require("express");
const router = express.Router();

const { saveAttendance, checkAttendance } = require("../controllers/attendanceController");

router.post("/attendance", saveAttendance);
router.get(
    "/sections/:sectionId/attendance/:date",
    checkAttendance
);

module.exports = router;