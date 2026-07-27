const pool = require("../config/db");

const saveAttendance = async (req, res) => {
  const { date, attendance } = req.body;

  if (!date || !attendance) {
    return res.status(400).json({
      success: false,
      message: "Date and attendance are required.",
    });
  }

  if (!Array.isArray(attendance)) {
    return res.status(400).json({
      success: false,
      message: "Attendance must be an array.",
    });
  }

  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      for (const record of attendance) {
        const { studentId, status } = record;

        await client.query(
          `
    INSERT INTO attendance
    (student_id, attendance_date, status)

    VALUES ($1, $2, $3)

    ON CONFLICT (student_id, attendance_date)

    DO UPDATE SET
    status = EXCLUDED.status
    `,
          [studentId, date, status],
        );
      }

      await client.query("COMMIT");

      return res.status(200).json({
        success: true,
        message: "Attendance saved successfully.",
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const checkAttendance = async (req, res) => {
  try {
    const { sectionId, date } = req.params;

    if (!sectionId || !date) {
      return res.status(400).json({
        success: false,
        message: "Section ID and date are required.",
      });
    }

    const query = `
    SELECT 1
    FROM attendance a
    JOIN students s
    ON a.student_id = s.id

    WHERE
    s.section_id = $1
    AND a.attendance_date = $2

    LIMIT 1;
`;

    const result = await pool.query(query, [sectionId, date]);

    if (result.rows.length > 0) {
      return res.status(200).json({
        success: true,
        exists: true,
      });
    }

    return res.status(200).json({
      success: true,
      exists: false,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const getAttendanceByDate = async (req, res) => {
  try {
    const { sectionId, date } = req.params;

    const result = await pool.query(
      `
      SELECT
          s.id AS student_id,
          s.roll_no,
          s.student_name,
          a.status
      FROM students s
      LEFT JOIN attendance a
        ON s.id = a.student_id
      WHERE s.section_id = $1
        AND a.attendance_date = $2
      ORDER BY s.roll_no;
      `,
      [sectionId, date],
    );

    res.status(200).json({
      attendance: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching attendance.",
    });
  }
};

const updateAttendance = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { studentId, attendanceDate, status, accessCode } = req.body;

    // Validate input
    if (!studentId || !attendanceDate || !status || !accessCode) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Find the student's section
    const studentResult = await client.query(
      `
      SELECT section_id
      FROM students
      WHERE id = $1
      `,
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    const sectionId = studentResult.rows[0].section_id;

    // Verify section access code
    const sectionResult = await client.query(
      `
      SELECT access_code
      FROM sections
      WHERE id = $1
      `,
      [sectionId]
    );

    if (sectionResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Section not found.",
      });
    }

    if (sectionResult.rows[0].access_code !== accessCode) {
      await client.query("ROLLBACK");
      return res.status(401).json({
        message: "Invalid access code.",
      });
    }

    // Update attendance
    const updateResult = await client.query(
      `
      UPDATE attendance
      SET status = $1
      WHERE student_id = $2
        AND attendance_date = $3
      `,
      [status, studentId, attendanceDate]
    );

    if (updateResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Attendance record not found.",
      });
    }

    await client.query("COMMIT");

    return res.status(200).json({
      message: "Attendance updated successfully.",
    });

  } catch (err) {
    await client.query("ROLLBACK");

    console.error(err);

    return res.status(500).json({
      message: "Failed to update attendance.",
    });

  } finally {
    client.release();
  }
};

module.exports = {
  saveAttendance,
  checkAttendance,
  getAttendanceByDate,
  updateAttendance,
};
