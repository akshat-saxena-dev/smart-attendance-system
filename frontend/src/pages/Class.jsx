import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getSections,
    createSection
} from "../services/sectionService";

function Class() {

    const { classId } = useParams();

    const schoolId = localStorage.getItem("schoolId");

    const [sections, setSections] = useState([]);

    const fetchSections = async () => {

        try {

            const data = await getSections(
                schoolId,
                classId
            );

            if (data.success) {
                setSections(data.sections);
            }

        }
        catch (err) {

            alert(
                err.response?.data?.message ||
                "Unable to fetch sections"
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

                const data = await createSection(
                    schoolId,
                    classId,
                    teacherName
                );

                alert(
                    `Section ${data.sectionName} created.\nAccess Code: ${data.accessCode}`
                );

                await fetchSections();

            }
            catch (err) {

                alert(
                    err.response?.data?.message ||
                    "Unable to create section"
                );

            }

        };

    return (

        <div>

            <h1>Class</h1>

            <h2>Sections</h2>

            {
                sections.length === 0
                    ? (
                        <p>No sections yet.</p>
                    )
                    : (
                        sections.map((section) => (

                            <button
                                key={section.id}
                                style={{
                                    display: "block",
                                    marginBottom: "10px"
                                }}
                            >
                                Section {section.sectionName}
                            </button>

                        ))
                    )
            }

            <br />

            <button onClick={handleAddSection}>Add Section</button>

        </div>

    );

}

export default Class;