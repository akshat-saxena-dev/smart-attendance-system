import { useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { getAttendanceByDate, updateAttendance } from "../services/attendanceServices";

function ViewAttendance() {
  const { sectionId } = useParams();

  const [selectedDate, setSelectedDate] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleSearch = async () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    try {
      const data = await getAttendanceByDate(sectionId, selectedDate);

      setAttendance(data.attendance || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch attendance.");
    }
  };

  const handleToggle = (student) => {
    setSelectedStudent(student);
    setAccessCode("");
    setShowAccessModal(true);
  };

  const handleVerify = async () => {
  if (accessCode.trim() === "") {
    alert("Please enter the section access code.");
    return;
  }

  try {
    await updateAttendance(
      selectedStudent.student_id,
      selectedDate,
      selectedStudent.status === "Present"
        ? "Absent"
        : "Present",
      accessCode
    );

    alert("Attendance updated successfully.");

    setShowAccessModal(false);
    setAccessCode("");

    // Refresh attendance table
    const data = await getAttendanceByDate(
      sectionId,
      selectedDate
    );

    setAttendance(data.attendance);

  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div className="student-page">
      <BackButton />

      <h1>View Attendance</h1>

      <p>Section ID: {sectionId}</p>

      <br />

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <button style={{ marginLeft: "10px" }} onClick={handleSearch}>
        Search
      </button>

      <hr style={{ margin: "20px 0" }} />

      {attendance.length === 0 ? (
        <p>No attendance found.</p>
      ) : (
        <div className="table-container">
         <table className="table-head">   
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((student) => (
              <tr className="table-row" key={student.student_id}>
                <td>{student.roll_no}</td>
                <td>{student.student_name}</td>
                <td>{student.status ?? "Not Marked"}</td>
                <td>
                  <button onClick={() => handleToggle(student)}  className="action-btn">
                    {student.status === "Present"
                      ? "Mark Absent"
                      : "Mark Present"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        
      )}

      {showAccessModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              minWidth: "300px",
            }}
          >
            <h3>Verify Section Access Code</h3>

            <input
              type="password"
              placeholder="Enter access code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />

            <br />
            <br />

            <button
              onClick={handleVerify}
            >
              Verify
            </button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => setShowAccessModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAttendance;
