const pool = require("../config/db");
const { readImage, parseStudents } = require("../services/ocrService");

const addStudents = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { students } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Student list is required.",
      });
    }

    const rollResult = await pool.query(
      `SELECT COALESCE(MAX(roll_no), 0) AS max_roll
             FROM students
             WHERE section_id = $1`,
      [sectionId],
    );

    for (const student of students) {
      const rollNo =
        typeof student === "string"
          ? rollResult.rows[0].max_roll + 1
          : student.roll_no;

      const studentName =
        typeof student === "string" ? student : student.student_name;

      await pool.query(
        `INSERT INTO students
      (section_id, roll_no, student_name)
      VALUES ($1, $2, $3)`,
        [sectionId, rollNo, studentName],
      );

      if (typeof student === "string") {
        rollResult.rows[0].max_roll++;
      }
    }

    res.status(201).json({
      success: true,
      message: "Students added successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to add students.",
    });
  }
};

const getStudents = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const result = await pool.query(
      `SELECT id, roll_no, student_name
             FROM students
             WHERE section_id = $1
             ORDER BY roll_no`,
      [sectionId],
    );

    const students = result.rows.map((student) => ({
      id: student.id,
      rollNo: student.roll_no,
      studentName: student.student_name,
    }));

    res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch students.",
    });
  }
};

const addStudent = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { rollNo, studentName } = req.body;

    console.log({
      rollNo,
      type: typeof rollNo,
      studentName,
    });

    if (rollNo === undefined || !studentName || studentName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Roll number and student name are required.",
      });
    }

    if (!Number.isInteger(rollNo)) {
      return res.status(400).json({
        success: false,
        message: "Roll number must be an integer.",
      });
    }

    if (rollNo < 1) {
      return res.status(400).json({
        success: false,
        message: "Roll number must be greater than 0.",
      });
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) AS count
     FROM students
     WHERE section_id = $1`,
      [sectionId],
    );

    const totalStudents = Number(countResult.rows[0].count);

    if (rollNo > totalStudents + 1) {
      return res.status(400).json({
        success: false,
        message: `Roll number must be between 1 and ${totalStudents + 1}.`,
      });
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        `UPDATE students
     SET roll_no = roll_no + 1000
     WHERE section_id = $1
     AND roll_no >= $2`,
        [sectionId, rollNo],
      );

      await client.query(
        `UPDATE students
     SET roll_no = roll_no - 999
     WHERE section_id = $1
     AND roll_no >= 1000`,
        [sectionId],
      );

      await client.query(
        `INSERT INTO students
    (section_id, roll_no, student_name)
    VALUES ($1, $2, $3)`,
        [sectionId, rollNo, studentName.trim()],
      );

      await client.query("COMMIT");

      return res.status(201).json({
        success: true,
        message: "Student added successfully.",
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to add student.",
    });
  }
};

const deleteStudents = async (req, res) => {
  const { sectionId } = req.params;

  if (!sectionId) {
    return res.status(400).json({
      success: false,
      message: "Section ID is required.",
    });
  }

  try {
    const result = await pool.query(
      `
    DELETE FROM students
    WHERE section_id = $1
    `,
      [sectionId],
    );

    return res.status(200).json({
      success: true,
      message: "Students deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const deleteStudent = async (req, res) => {
  const { studentId } = req.params;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Find the student first
    const student = await client.query(
      `SELECT section_id, roll_no
       FROM students
       WHERE id = $1`,
      [studentId],
    );

    if (student.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    const { section_id, roll_no } = student.rows[0];

    // Delete student
    await client.query("DELETE FROM students WHERE id = $1", [studentId]);

    // Shift roll numbers
    await client.query(
      `UPDATE students
       SET roll_no = roll_no - 1
       WHERE section_id = $1
       AND roll_no > $2`,
      [section_id, roll_no],
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Student deleted successfully.",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to delete student.",
    });
  } finally {
    client.release();
  }
};

const uploadStudentsOCR = async (req, res) => {
  try {
    const text = await readImage(req.file.path);

    console.log("OCR TEXT:");
    console.log(text);

    const students = parseStudents(text);

    console.log(students);

    res.json({
      students,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "OCR failed.",
    });
  }
};

module.exports = {
  addStudents,
  getStudents,
  deleteStudents,
  deleteStudent,
  addStudent,
  uploadStudentsOCR,
};
