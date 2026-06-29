const pool = require("../config/db");
const bcrypt = require("bcrypt");

const registerSchool = async (req, res) => {

    try {    
        const { schoolName, password } = req.body;

        if (!schoolName || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const checkSchoolQuery = "SELECT * FROM schools WHERE school_name = $1";
        const existingSchool = await pool.query(checkSchoolQuery, [schoolName]);

        if (existingSchool.rows.length > 0) {
            return res.status(409).json({
                "success": false,
                "message": "School already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertedSchool = await pool.query(
            `INSERT INTO schools (school_name, password_hash)
            VALUES ($1, $2)
            RETURNING id`,
            [schoolName, hashedPassword]
        );

        const SCHOOL_ID_OFFSET = 10000;
        const schoolID = `SCH${SCHOOL_ID_OFFSET + insertedSchool.rows[0].id}`;

        return res.status(201).json({
            success: true,
            message: "School registered successfully!",
            schoolId: schoolID
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

module.exports = {
    registerSchool
};