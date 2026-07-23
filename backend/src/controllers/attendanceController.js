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

module.exports = {
  saveAttendance,
  checkAttendance,
};