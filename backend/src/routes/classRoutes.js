const express = require("express");
const router = express.Router();

const { createClass, getClasses } = require("../controllers/classController");

router.get("/schools/:schoolId/classes", getClasses);
router.post("/schools/:schoolId/classes", createClass);


module.exports = router;