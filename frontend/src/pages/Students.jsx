import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { useNavigate, useParams } from "react-router-dom";
import {
  addStudents,
  getStudents,
  deleteStudents,
  deleteStudent,
  addStudent,
} from "../services/studentServices";
import {
  saveAttendance,
  checkAttendance,
} from "../services/attendanceServices";
import Loader from "../components/Loader";

function Students() {
  const { sectionId } = useParams();

  const [showInput, setShowInput] = useState(false);
  const [studentText, setStudentText] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [attendance, setAttendance] = useState({});
  const [attendanceExists, setAttendanceExists] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newRollNo, setNewRollNo] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const studentArray = studentText
        .split("\n")
        .map((name) => name.trim())
        .filter((name) => name !== "");

      if (studentArray.length === 0) {
        alert("Please enter at least one student.");
        return;
      }

      await addStudents(sectionId, studentArray);

      await fetchStudents();

      alert("Students added successfully!");

      setStudentText("");
      setShowInput(false);
    } catch (error) {
      console.error(error);
      alert("Unable to add students.");
    }
  };

  const handleAddStudent = async () => {
    if (newRollNo.trim() === "" || newStudentName.trim() === "") {
      alert("Please fill all fields.");
      return;
    }

    console.log({
      newRollNo,
      converted: Number(newRollNo),
      type: typeof Number(newRollNo),
    });

    try {
      await addStudent(sectionId, Number(newRollNo), newStudentName);

      alert("Student added successfully.");

      await fetchStudents();
      setNewRollNo("");
      setNewStudentName("");
      setShowAddStudent(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add student.");
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await getStudents(sectionId);
      console.log(data.student);
      setStudents(data.students);
    } catch (error) {
      alert("Unable to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [sectionId]);

  const handleDeleteStudents = async () => {
    const confirmDelete = window.confirm(
      "Delete all students? This will also delete all attendance records.",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteStudents(sectionId);
      setStudents([]);

      alert("Students deleted successfully.");
    } catch (err) {
      console.error(err);

      alert("Failed to delete students.");
    }
  };

  const handleDeleteStudent = async (studentId) => {
    const confirmDelete = window.confirm("Delete this student?");

    if (!confirmDelete) return;

    try {
      await deleteStudent(studentId);

      alert("Student deleted successfully.");

      await fetchStudents();
    } catch (error) {
      console.error(error);

      alert("Failed to delete student.");
    }
  };

  const saveAttendanceRecord = async () => {
    if (!selectedDate) {
      alert("Please select a date first.");
      return;
    }

    if (Object.keys(attendance).length !== students.length) {
      alert("Please mark attendance for all students.");
      return;
    }

    try {
      const attendanceArray = Object.entries(attendance).map(
        ([studentId, status]) => ({
          studentId: Number(studentId),
          status,
        }),
      );

      await saveAttendance(selectedDate, attendanceArray);

      alert("Attendance saved successfully!");

      setAttendance({});
      setAttendanceExists(true);
      setSelectedDate("");
    } catch (err) {
      console.error(err);

      alert("Unable to save attendance.");
    }
  };

  const checkAttendanceForDate = async (date) => {
    try {
      const data = await checkAttendance(sectionId, date);

      if (data.exists) {
        alert(
          `Attendance for ${date} has already been recorded. Please select another date.`,
        );

        setAttendanceExists(true);
        setSelectedDate("");
        return;
      } else {
        setAttendanceExists(false);

        // Reset the page for new attendance
        setAttendance({});
      }
    } catch (err) {
      console.error(err);

      alert("Unable to check attendance.");
    }
  };

  const handleAttendance = (studentId, status) => {
    if (!selectedDate) {
      alert("Please select a date first.");
      return;
    }

    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleDateChange = async (e) => {
    const newDate = e.target.value;

    const markedStudents = Object.keys(attendance).length;

    if (markedStudents > 0 && markedStudents < students.length) {
      const confirmChange = window.confirm(
        "You have unsaved attendance. Changing the date will discard it. Continue?",
      );

      if (!confirmChange) {
        return;
      }

      setAttendance({});
    }

    setSelectedDate(newDate);

    await checkAttendanceForDate(newDate);
  };

  if (loading) return <Loader />

  return (
    <div className="student-page">
      <BackButton fallback="/dashboard" />

      <div>
        <h1>Students Dashboard</h1>

        <p>Section ID: {sectionId}</p>

        <button
          onClick={() => navigate(`/sections/${sectionId}/view-attendance`)}
        >
          View Attendance
        </button>

        {students.length === 0 ? (
          <>
            {
              <button onClick={() => setShowInput(true)}>
                Add Students Manually
              </button>
            }

            {
              <>
                <br />
                <br />
                <button onClick={() => navigate(`/sections/${sectionId}/ocr`)}>
                  OCR Upload
                </button>
              </>
            }
          </>
        ) : (
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={() => {
                if (showAddStudent) {
                  setNewRollNo("");
                  setNewStudentName("");
                }

                setShowAddStudent(!showAddStudent);
              }}
            >
              {showAddStudent ? "Cancel" : "Add More Student"}
            </button>

            <button onClick={handleDeleteStudents}>Delete All Students</button>
          </div>
        )}

        {showAddStudent && (
          <div style={{ marginTop: "20px" }}>
            <h4>Add Student</h4>

            <div style={{ marginBottom: "10px" }}>
              <input
                type="number"
                placeholder="Roll Number"
                value={newRollNo}
                onChange={(e) => setNewRollNo(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Student Name"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
              />
            </div>

            <button onClick={handleAddStudent}>Add Student</button>
          </div>
        )}

        {showInput && (
          <div>
            <br />

            <textarea
              rows={10}
              cols={40}
              placeholder="Enter one student per line"
              value={studentText}
              onChange={(e) => setStudentText(e.target.value)}
            />

            <br />
            <br />

            <button onClick={handleSave}>Save Students</button>
          </div>
        )}

        <br />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e)}
        />

        <div className="student-row header-row">
          <div className="student-name">
            <strong>Student Name</strong>
          </div>

          <div className="student-actions-nav">
            <strong
              style={{ width: "100px", textAlign: "end" }}
              className="present-btn"
            >
              Present
            </strong>
            <strong
              style={{ width: "100px", textAlign: "end" }}
              className="absent-btn"
            >
              Absent
            </strong>
            <strong
              style={{ width: "80px", textAlign: "end" }}
              className="delete-btn"
            >
              Delete
            </strong>
          </div>
        </div>

        {students.map((student) => (
          <div className="student-row" key={student.id}>
            <div className="student-name">
              {student.rollNo}. {student.studentName}
            </div>

            <div className="student-actions">
              <button
                className={`attendance-btn ${
                  attendance[student.id] === "Present" ? "present-active" : ""
                }`}
                onClick={() => handleAttendance(student.id, "Present")}
              >
                {attendance[student.id] === "Present" ? "✔ " : "Present"}
              </button>

              <button
                className={`attendance-btn ${
                  attendance[student.id] === "Absent" ? "absent-active" : ""
                }`}
                onClick={() => handleAttendance(student.id, "Absent")}
              >
                {attendance[student.id] === "Absent" ? "✖ " : "Absent"}
              </button>
              <div
                className="icon-btn"
                onClick={() => handleDeleteStudent(student.id)}
                style={{ cursor: "pointer" }}
              >
                <span className="material-symbols-outlined">delete</span>
              </div>
            </div>
          </div>
        ))}

        {students.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <button onClick={saveAttendanceRecord}>Save Attendance</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Students;
