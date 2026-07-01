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


const loginSchool = async (req, res) => {
    try {
        const {schoolId, password} = req.body;

        if (!schoolId || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const schoolNumericId = Number(schoolId.replace("SCH", "")) - 10000;

        if (isNaN(schoolNumericId) || schoolNumericId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid School ID"
            });
        }

        const findSchool = await pool.query(
            "SELECT * FROM schools WHERE id = $1",
            [schoolNumericId]
        );

        if (findSchool.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "School not found"
            });
        }

        const storedHash = findSchool.rows[0].password_hash;

        const isMatch = await bcrypt.compare(
            password, storedHash
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful"
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
    registerSchool, loginSchool
};