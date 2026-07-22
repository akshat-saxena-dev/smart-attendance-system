import BackButton from "../components/BackButton";
import { useParams } from "react-router-dom";

function Students() {
    const { sectionId } = useParams();

    return (
        <div className="student-page">
            <BackButton fallback="/dashboard" />
        <div>
            <h1>Students Dashboard</h1>

            <p>Section ID: {sectionId}</p>

            <button>
                Add Students Manually
            </button>

            <br />
            <br />

            <button>
                Add Students using OCR
            </button>
        </div>
        </div>
    );
}

export default Students;