import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addStudents, getStudents } from "../services/studentServices";

function Students() {
  const { sectionId } = useParams();

  const [showInput, setShowInput] = useState(false);
  const [studentText, setStudentText] = useState("");
  const [students, setStudents] = useState([]);

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

      alert("Students added successfully!");

      setStudentText("");
      setShowInput(false);
    } catch (error) {
      console.error(error);
      alert("Unable to add students.");
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await getStudents(sectionId);
      setStudents(data.students);
    } catch (error) {
      console.error(error);
      alert("Unable to fetch students.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <h1>Students Dashboard</h1>

      <p>Section ID: {sectionId}</p>

      <button onClick={() => setShowInput(true)}>Add Students Manually</button>

      <br />
      <br />

      <button>Add Students using OCR</button>

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

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          {students.length > 0 && (
            <div>
              <h2>Students</h2>

              {students.map((student) => (
                <div key={student.id}>
                  {student.rollNo}. {student.studentName}
                </div>
              ))}
            </div>
          )}

          <button onClick={handleSave}>Save Students</button>
        </div>
      )}
    </div>
  );
}

export default Students;
