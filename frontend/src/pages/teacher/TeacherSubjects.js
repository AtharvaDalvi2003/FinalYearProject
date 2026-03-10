import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./teacher.css";

function TeacherSubjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/subjects/my-subjects", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>🎓 Teacher Panel</h2>

        <button onClick={() => navigate("/teacher/dashboard")}>
          Dashboard
        </button>

        <button className="active">View Subjects</button>

        <button onClick={() => alert("Classes – next step")}>
          Create / View Classes
        </button>

        <button onClick={() => alert("Students – next step")}>
          View Students
        </button>

        <button onClick={() => alert("Absentees – next step")}>
          View Absentees
        </button>

        <button
          className="logout"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="content">
        <h1>📚 My Subjects</h1>

        {loading && <p>Loading subjects...</p>}

        {!loading && subjects.length === 0 && (
          <p>No subjects created yet</p>
        )}

        <div className="cards">
          {subjects.map((sub) => (
            <div key={sub._id} className="card">
              <h3>{sub.subjectName}</h3>
              <p>Code: {sub.subjectCode}</p>
            </div>
          ))}
        </div>

        <br />
        <button onClick={() => navigate("/teacher/dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </main>
    </div>
  );
}

export default TeacherSubjects;
