const pool = require("../config/db");
const { generateAccessCode } = require("../utils/accessCode");
const { getNumericSchoolId } = require("../utils/schoolId");
const { getNextSection } = require("../utils/section");

const addSection = async (req, res) => {
    try {
        const {classId} = req.params;
        const {teacherName} = req.body;

        if (!teacherName || !classId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        let result = await pool.query("SELECT * FROM classes WHERE id = $1", [classId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Class does not exists"
            });
        }

        result = await pool.query("SELECT section_name FROM sections WHERE class_id = $1 ORDER BY section_name DESC LIMIT 1", [classId]);

        const lastSection =
            result.rows.length === 0
                ? null
                : result.rows[0].section_name;

        const sectionName = getNextSection(lastSection);
        const accessCode = generateAccessCode();

        result = await pool.query(`INSERT INTO sections
            (
                class_id,
                section_name,
                teacher_name,
                access_code
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )`, [classId, sectionName, teacherName, accessCode]
        );

        return res.status(201).json({
            success: true,
            message: "Section created successfully",
            sectionName,
            accessCode
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


const getSections = async (req, res) => {

    try {

        const { schoolId, classId } = req.params;

        const numericSchoolId = getNumericSchoolId(schoolId);

        if (numericSchoolId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid School ID"
            });
        }

        const classResult = await pool.query(
            `SELECT *
             FROM classes
             WHERE id = $1
             AND school_id = $2`,
            [classId, numericSchoolId]
        );

        if (classResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }
        
        const result = await pool.query(
            `SELECT
                id,
                section_name,
                teacher_name
             FROM sections
             WHERE class_id = $1
             ORDER BY section_name`,
            [classId]
        );

        const sections = result.rows.map((row) => ({
            id: row.id,
            sectionName: row.section_name,
            teacherName: row.teacher_name
        }));

        return res.status(200).json({
            success: true,
            sections
        });

    }
    catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


const verifySection = async (req, res) => {
    try {

        const { sectionId } = req.params;
        const { accessCode } = req.body;

        if (!sectionId || !accessCode) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const result = await pool.query(
            `SELECT section_name, teacher_name, access_code
             FROM sections
             WHERE id = $1`,
            [sectionId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        const storedAccessCode = result.rows[0].access_code;

        if (storedAccessCode !== accessCode) {
            return res.status(401).json({
                success: false,
                message: "Invalid access code"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Access granted",
            sectionId,
            teacherName: result.rows[0].teacher_name,
            sectionName: result.rows[0].section_name

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


module.exports = {
    addSection, verifySection, getSections
}