import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./teacher.css";

function TeacherClasses() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [className, setClassName] = useState("");
  const [selectedSubject, setSelectedSubject] = useState({});

  // Load classes & subjects
  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  const fetchClasses = async () => {
    const res = await fetch("http://localhost:5000/api/classes/my-classes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setClasses(Array.isArray(data) ? data : []);
  };

  const fetchSubjects = async () => {
    const res = await fetch("http://localhost:5000/api/subjects/my-subjects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSubjects(Array.isArray(data) ? data : []);
  };

  const createClass = async () => {
    if (!className) return alert("Enter class name");

    await fetch("http://localhost:5000/api/classes/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: className }),
    });

    setClassName("");
    fetchClasses();
  };

  const linkSubject = async (classId) => {
    if (!selectedSubject[classId]) {
      return alert("Select subject");
    }

    await fetch("http://localhost:5000/api/classes/link-subject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        classId,
        subjectId: selectedSubject[classId],
      }),
    });

    fetchClasses();
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>🎓 Teacher Panel</h2>

        <button onClick={() => navigate("/teacher/dashboard")}>
          Dashboard
        </button>

        <button onClick={() => navigate("/teacher/subjects")}>
          View Subjects
        </button>

        <button className="active">
          Create / View Classes
        </button>

        <button onClick={() => navigate("/teacher/students")}>
          View Students
        </button>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </button>
      </aside>

      <main className="content">
        <h1>Create / View Classes</h1>

        <div className="card">
          <h3>Create Class</h3>
          <input
            placeholder="Class Name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
          <button onClick={createClass}>Create</button>
        </div>

        <h3>My Classes</h3>

        <div className="cards">
          {classes.map((cls) => (
            <div className="card" key={cls._id}>
              <h4>{cls.name}</h4>

              <p>
                Subject:{" "}
                {cls.subject ? (
                  <b>{cls.subject.name}</b>
                ) : (
                  <span style={{ color: "red" }}>Not linked</span>
                )}
              </p>

              {!cls.subject && (
                <>
                  <select
                    onChange={(e) =>
                      setSelectedSubject({
                        ...selectedSubject,
                        [cls._id]: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name} {/* ✅ FIXED */}
                      </option>
                    ))}
                  </select>

                  <button onClick={() => linkSubject(cls._id)}>
                    Link Subject
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default TeacherClasses;

