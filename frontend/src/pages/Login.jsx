import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSchool } from "../services/authService";

function Login() {
  const [schoolId, setSchoolId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const data = await loginSchool(schoolId, password);

        console.log(data);

        if (data.success) {
            localStorage.setItem("schoolId", schoolId);
            navigate("/dashboard");
        }
    }
    catch (err) {
        alert(
            err.response?.data?.message || "Login failed"
        );
    }
  };

  return (
    <div className="login-container">
      <h1>School Login</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label>School ID</label>
          <br />
          <input
            type="text"
            placeholder="Enter School ID"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;