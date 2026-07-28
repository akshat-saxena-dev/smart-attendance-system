import { useState } from "react";
import { uploadStudentImage, addStudents } from "../services/studentServices";
import { useParams, useNavigate } from "react-router-dom";
import "./OCRUpload.css";

function OCRUpload() {
  const [image, setImage] = useState(null);
  const [students, setStudents] = useState([]);

  const { sectionId } = useParams();
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    try {
      const data = await uploadStudentImage(image);

      setStudents(data.students);

      console.log(data.students);

      alert("OCR completed successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  const handleImport = async () => {
    if (students.length === 0) {
      alert("No students to import.");
      return;
    }

    try {
      await addStudents(sectionId, students);

      alert("Students imported successfully!");

      navigate(`/sections/${sectionId}/students`);
    } catch (err) {
      console.error(err);

      alert("Import failed.");
    }
  };

  return (
    <div className="ocr-upload-container">
      <h2>Upload Student List</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <br />
      <br />

      <button onClick={handleUpload}>Upload</button>

      <br />
      <br />

      {students.length > 0 && (
        <>
          <h3>Review Students</h3>

          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="number"
                      value={student.roll_no}
                      onChange={(e) => {
                        const updated = [...students];
                        updated[index].roll_no = Number(e.target.value);
                        setStudents(updated);
                      }}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={student.student_name}
                      onChange={(e) => {
                        const updated = [...students];
                        updated[index].student_name = e.target.value;
                        setStudents(updated);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <br />

          <button onClick={handleImport}>Confirm Import</button>
        </>
      )}
    </div>
  );
}

export default OCRUpload;
