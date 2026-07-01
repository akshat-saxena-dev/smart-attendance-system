const pool = require("../config/db");
const { getNumericSchoolId } = require("../utils/schoolId");

const createClass = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { className } = req.body;

        if (!schoolId || !className) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const numericSchoolId = getNumericSchoolId(schoolId);

        const classNumber = Number(className);

        if (numericSchoolId <= 0 || classNumber < 1 || classNumber > 12) {
            return res.status(400).json({
                success: false,
                message: "Invalid School ID or Class"
            });
        }

        const result = await pool.query("SELECT * FROM classes WHERE school_id = $1 AND class_name = $2", [numericSchoolId, classNumber]);

        if (result.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Class already exists"
            });
        }

        await pool.query(
            `INSERT INTO classes (school_id, class_name)
            VALUES ($1, $2)
            RETURNING id`,
            [numericSchoolId, classNumber]
        );

        return res.status(201).json({
            success: true,
            message: "Class created successfully"
        });
    }
    catch(err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });  
    }
};


const getClasses = async (req, res) => {
    try {
        const {schoolId} = req.params;
        const numericSchoolId = getNumericSchoolId(schoolId);


        if (numericSchoolId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid School ID"
            });
        }

        const result = await pool.query(
            "SELECT id, class_name FROM classes WHERE school_id = $1 ORDER BY class_name", [numericSchoolId]
        );


        const classes = result.rows.map((row) => ({
            id: row.id,
            className: row.class_name
        }));

        return res.status(200).json({
            success: true,
            classes
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    createClass, getClasses
};