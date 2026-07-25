import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";
import { useLocation,
         useNavigate, 
          useParams 
        } from "react-router-dom";
import {
  getSections,
  createSection,
  verifySection,
} from "../services/sectionService";

function Class() {
   const navigate = useNavigate();
  const location = useLocation();

  const currentClassName=
      location.state?.className ||
      location.state?.name ||
      "";

  const { classId } = useParams();

  const schoolId = localStorage.getItem("schoolId");

  const [sections, setSections] = useState([]);


  const fetchSections = async () => {
    try {
      const data = await getSections(schoolId, classId);

      if (data.success) {
        setSections(data.sections);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Unable to fetch sections");
    }
  };

const handleOpenSection = async (section) => {
    const sectionId =
        section?.id ||
        section?._id ||
        section?.sectionId;

    if (!sectionId) {
        alert("Section ID is missing.");
        return;
    }

    const enteredAccessCode = window.prompt(
        `Enter the access code for ${
            section?.sectionName ||
            section?.name ||
            "this section"
        }`
    );

    if (enteredAccessCode === null) {
        return;
    }

    if (!enteredAccessCode.trim()) {
        alert("Please enter the access code.");
        return;
    }

    try {
        const data = await verifySection(
            sectionId,
            enteredAccessCode.trim()
        );

        if (!data?.success) {
            alert(
                data?.message ||
                    "The access code is incorrect."
            );
            return;
        }

        const pageDetails = {
            className: currentClassName,

            sectionName:
                section?.sectionName ||
                section?.name ||
                "",

            teacherName:
                section?.teacherName ||
                section?.teacher_name ||
                section?.classTeacher ||
                section?.teacher?.name ||
                "",
        };

        localStorage.setItem(
            `attendance-section-details-${sectionId}`,
            JSON.stringify(pageDetails)
        );

        navigate(
            `/sections/${sectionId}/students`,
            {
                state: pageDetails,
            }
        );
    } catch (error) {
        console.error(
            "Unable to open section:",
            error
        );

        alert(
            error.response?.data?.message ||
                error.message ||
                "Unable to verify the access code."
        );
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
            type="button"
            onClick={() => handleOpenSection(section)}
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