import { useEffect, useState } from "react";
import { getClasses, createClass } from "../services/classService";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [classes, setClasses] = useState([]);
  const schoolId = localStorage.getItem("schoolId");

  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      const data = await getClasses(schoolId);

      if (data.success) {
        setClasses(data.classes);
      }
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Unable to fetch classes");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAddClass = async () => {
    const className = prompt("Enter class (1-12)");

    if (className === null) return;

    const classNumber = Number(className);

    if (isNaN(classNumber) || classNumber < 1 || classNumber > 12) {
      alert("Please enter a class between 1 and 12.");
      return;
    }

    try {
      const data = await createClass(schoolId, classNumber);

      alert(data.message);

      await fetchClasses();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to create class");
    }
  };

  return (
    <div>
      <h1>School Dashboard</h1>

      <h2>Classes</h2>

      {classes.length === 0 ? (
        <p>No classes added yet.</p>
      ) : (
        classes.map((cls) => (
          <button
            key={cls.id}
            style={{
              display: "block",
              marginBottom: "10px",
            }}
            onClick={() =>
              navigate(`/classes/${cls.id}`, {
                state: {
                  className: cls.className,
                },
              })
            }
          >
            Class {cls.className}
          </button>
        ))
      )}

      <br />

      <button onClick={handleAddClass}>Add Class</button>
    </div>
  );
}

export default Dashboard;
