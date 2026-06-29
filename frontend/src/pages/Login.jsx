import { useState } from "react";

function Login() {
  const [schoolId, setSchoolId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    console.log({
      schoolId,
      password,
    });
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