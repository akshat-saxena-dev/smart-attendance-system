const express = require("express");
const router = express.Router();

const { saveAttendance, checkAttendance, getAttendanceByDate, updateAttendance } = require("../controllers/attendanceController");

router.post("/", saveAttendance);
router.get(
    "/sections/:sectionId/attendance/:date",
    checkAttendance
);
router.get("/:sectionId/:date", getAttendanceByDate);
router.put("/update", updateAttendance);

module.exports = router;