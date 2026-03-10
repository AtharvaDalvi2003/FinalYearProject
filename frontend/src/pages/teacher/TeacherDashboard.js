import React from "react";
import { useNavigate } from "react-router-dom";
import "./teacher.css";

function TeacherDashboard() {
  const navigate = useNavigate();

  // you can later replace this with real teacher name from API
  const teacherName = "Teacher";

  return (
    <div className="teacher-layout">
      {/* SIDEBAR */}
      <aside className="teacher-sidebar">
        <div className="logo">
          📸 <span>CAPTURE IT!</span>
        </div>

        <nav>
          <button className="active">📊 Dashboard</button>
          <button onClick={() => navigate("/teacher/classes")}>🏫 Classrooms</button>
          <button onClick={() => navigate("/teacher/students")}>👨‍🎓 All Students</button>
          <button onClick={() => navigate("/teacher/absentees")}>❌ Absent Students</button>
        </nav>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          🚪 Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="teacher-main">
        {/* TOP BAR */}
        <div className="top-bar">
          <div>
            <h1>Dashboard</h1>
            <p className="breadcrumb">Dashboard / Classrooms</p>
          </div>

          <div className="welcome">
            👋 Welcome <b>{teacherName}</b>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card red">
            <p>Total Classrooms</p>
            <h2>0</h2>
          </div>

          <div className="stat-card orange">
            <p>Total Students Enrolled</p>
            <h2>6</h2>
          </div>

          <div className="stat-card green">
            <p>Total Lectures By You</p>
            <h2>0</h2>
          </div>

          <div className="stat-card blue">
            <p>Attendance in Your Class</p>
            <h2>0%</h2>
          </div>
        </div>

        {/* ACTION */}
        <div className="action-row">
          <button
            className="primary-btn"
            onClick={() => navigate("/teacher/classes")}
          >
            ➕ Create New Classroom
          </button>
        </div>
      </main>
    </div>
  );
}

export default TeacherDashboard;
