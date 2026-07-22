

import { useNavigate } from "react-router-dom";
import "./BackButton.css";

function BackButton({ fallback = "/" }) {
    const navigate = useNavigate();

    const handleBack = () => {
        const previousPageExists =
            window.history.state && window.history.state.idx > 0;

        if (previousPageExists) {
            navigate(-1);
        } else {
            navigate(fallback);
        }
    };

    return (
        <button
            type="button"
            className="page-back-button"
            onClick={handleBack}
        >
            <span className="back-arrow">←</span>
            Back
        </button>
    );
}

export default BackButton;