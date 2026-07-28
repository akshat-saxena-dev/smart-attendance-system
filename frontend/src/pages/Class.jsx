import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSections,
  createSection,
  verifySection,
} from "../services/sectionService";
import Loader from "../components/Loader";

function Class() {
  const { classId } = useParams();

  const schoolId = localStorage.getItem("schoolId");

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchSections = async () => {
    try {
      const data = await getSections(schoolId, classId);

      if (data.success) {
        setSections(data.sections);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Unable to fetch sections");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSection = async (sectionId) => {
    const accessCode = prompt("Enter Section Access Code");

    if (accessCode === null) return;

    if (accessCode.trim() === "") {
      alert("Access code cannot be empty.");
      return;
    }

    try {
      const data = await verifySection(sectionId, accessCode);

      if (data.success) {
        navigate(`/sections/${sectionId}/students`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Unable to verify access code");
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleAddSection = async () => {
    const teacherName = prompt("Enter Teacher Name");

    if (teacherName === null) return;

    if (teacherName.trim() === "") {
      alert("Teacher name cannot be empty.");
      return;
    }

    try {
      const data = await createSection(schoolId, classId, teacherName);

      alert(
        `Section ${data.sectionName} created.\nAccess Code: ${data.accessCode}`,
      );

      await fetchSections();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to create section");
    }
  };

  if (loading) return <Loader />

  return (
    <div className="class-page">
      <BackButton fallback="/dashboard" />
    <div>
      <h1>Class</h1>

      <h2>Sections</h2>

      {sections.length === 0 ? (
        <p>No sections yet.</p>
      ) : (
        sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleOpenSection(section.id)}
            style={{
              display: "block",
              marginBottom: "10px",
            }}
          >
            Section {section.sectionName}
          </button>
        ))
      )}

      <br />

      <button onClick={handleAddSection}>Add Section</button>
    </div>
    </div>
  );
}

export default Class;