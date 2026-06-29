import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function Home() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    return (
        <div>
            <h1>Smart Attendance System</h1>

            <button
                onClick={() => {
                    setShowLogin(true);
                    setShowRegister(false);
                }}
            >
                Login Existing School
            </button>

            <button
                onClick={() => {
                    setShowRegister(true);
                    setShowLogin(false);
                }}
            >
                Register New School
            </button>

            <hr />

            {showLogin && <Login />}
            {showRegister && <Register />}
        </div>
    );
}

export default Home;