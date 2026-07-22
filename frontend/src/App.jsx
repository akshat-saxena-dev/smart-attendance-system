import { BrowserRouter, Routes, Route } from "react-router-dom";

import Class from "./pages/Class";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/classes/:classId" element={<Class />} />
        <Route
          path="/sections/:sectionId/students"
          element={<Students />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;