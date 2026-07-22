
import { useNavigate } from "react-router-dom";
import "./Home.css";

function SchoolIcon({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M32 7V16M32 7L44 11L32 16"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                d="M15 29L32 18L49 29V52H15V29Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
            />

            <path
                d="M9 35H15V52H9V35ZM49 35H55V52H49V35Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
            />

            <path
                d="M27 52V39C27 36.2 29.2 34 32 34C34.8 34 37 36.2 37 39V52"
                stroke="currentColor"
                strokeWidth="3"
            />

            <path
                d="M7 52H57"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}

function LoginIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M10 17L15 12L10 7M15 12H3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                d="M14 4H19C20.1 4 21 4.9 21 6V18C21 19.1 20.1 20 19 20H14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function Home() {
  
    const navigate = useNavigate();

    return (
        <main className="home-page">
            <div className="home-stars" />
            <div className="home-glow" />

            <section className="attendance-card">
                <div className="information-panel">
                    <div className="dot-pattern" />

                    <div className="main-school-logo">
                        <SchoolIcon className="school-icon" />
                    </div>

                    <h1>
                        Smart Attendance
                        <br />
                        System
                    </h1>

                    <div className="pink-title-line" />

                    <p className="home-description">
                        A modern and intelligent solution to manage attendance
                        effortlessly.
                    </p>

                    <div className="feature-list">
                        <div className="feature-item">
                            <span className="feature-circle">◇</span>
                            <span>Secure &amp; Reliable</span>
                        </div>

                        <div className="feature-item">
                            <span className="feature-circle">◷</span>
                            <span>Real-time Tracking</span>
                        </div>

                        <div className="feature-item">
                            <span className="feature-circle">↗</span>
                            <span>Smart Reports</span>
                        </div>
                    </div>
                </div>

                <div className="card-divider" />

                <div className="action-panel">
                    <div className="attendance-illustration">
                        <span className="pink-symbol symbol-one">+</span>
                        <span className="pink-symbol symbol-two">○</span>
                        <span className="blue-symbol symbol-three">+</span>

                        <div className="illustration-background" />

                        <div className="clipboard">
                            <div className="clipboard-clip" />

                            <div className="check-row">
                                <span className="green-check">✓</span>
                                <span className="check-line line-long" />
                            </div>

                            <div className="check-row">
                                <span className="green-check">✓</span>
                                <span className="check-line line-medium" />
                            </div>

                            <div className="check-row">
                                <span className="green-check">✓</span>
                                <span className="check-line line-short" />
                            </div>

                            <div className="check-row disabled-row">
                                <span className="empty-check" />
                                <span className="check-line line-medium" />
                            </div>
                        </div>

                        <div className="student-circle">
                            <div className="student-head" />
                            <div className="student-body" />
                        </div>
                    </div>

                 <div className="home-buttons">
    <button
        className="login-school-button"
        type="button"
        onClick={() => navigate("/login")}
    >
        <span className="login-icon">
            <LoginIcon />
        </span>

        Login to Existing School
    </button>

    <button
        className="register-school-button"
        type="button"
        onClick={() => navigate("/register")}
    >
        <SchoolIcon className="register-school-icon" />
        Register New School
    </button>
</div>
                </div>
            </section>

        </main>
    );
}

export default Home;