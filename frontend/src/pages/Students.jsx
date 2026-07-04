import { useParams } from "react-router-dom";

function Students() {
    const { sectionId } = useParams();

    return (
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
    );
}

export default Students;