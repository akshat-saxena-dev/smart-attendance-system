import { useState } from "react";

function Register() {
    const [schoolName, setSchoolName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();

        if (password != confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        console.log({
            schoolName, 
            password
        });
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