import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerSchool } from "../services/authService";

function Register() {
    const [schoolName, setSchoolName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password != confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const data = await registerSchool(
                schoolName,
                password
            );

            navigate("/");

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Registration failed"
            );

        }
    }

    return (
        <div className="register-container">
            <h1>Register New School</h1>

            <form onSubmit={handleRegister}>
                <div>
                    <label>School Name</label>
                    <br />
                    <input 
                        type="text" 
                        placeholder="Enter School Name"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Set password</label>
                    <br />
                    <input 
                        type="password" 
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <div>
                    <label>Confirm Password</label>
                    <br />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Register</button>

            </form>

        </div>
    )
}

export default Register