function getNumericSchoolId(schoolId) {
    return Number(schoolId.replace("SCH", "")) - 10000;
}

module.exports = {
    getNumericSchoolId
};