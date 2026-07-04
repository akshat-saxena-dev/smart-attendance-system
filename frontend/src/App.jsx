import { BrowserRouter, Routes, Route } from "react-router-dom";

import Class from "./pages/Class";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/classes/:classId" element={<Class />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sections/:sectionId/students" element={<Students />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
