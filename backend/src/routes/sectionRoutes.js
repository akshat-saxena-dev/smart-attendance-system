const express = require("express");
const router = express.Router();

const {
    addSection,
    getSections,
    verifySection
} = require("../controllers/sectionController");

router.get(
    "/schools/:schoolId/classes/:classId/sections",
    getSections
);

router.post(
    "/schools/:schoolId/classes/:classId/sections",
    addSection
);

router.post(
    "/sections/:sectionId/verify",
    verifySection
);

module.exports = router;