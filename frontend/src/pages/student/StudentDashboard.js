import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./student.css";

export default function StudentDashboard() {
  const [className, setClassName] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:5000/api/student/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setClassName(res.data?.class?.name || null);
        setLoading(false);
      })
      .catch(() => {
        setClassName(null);
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="student-layout">
      {/* SIDEBAR */}
      <aside className="student-sidebar">
        <h2 className="logo">🎓 CAPTURE IT</h2>

        <button className="active">📊 Dashboard</button>
        <button disabled>👤 Profile</button>
        <button disabled>📷 Upload Image</button>

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

      {/* CONTENT */}
      <main className="student-content">
        {/* TOP BAR */}
        <div className="top-bar">
          <h1>Classrooms</h1>
          <div className="welcome">Welcome Student 👋</div>
        </div>

        <div className="breadcrumb">🏠 Dashboard / Classrooms</div>

        {/* STATS */}
        <div className="stats">
          <div className="stat-card">
            <span className="icon red">🏫</span>
            <p>Total Classrooms</p>
            <h2>{className ? 1 : 0}</h2>
          </div>

          <div className="stat-card">
            <span className="icon orange">🎓</span>
            <p>Enrolled</p>
            <h2>{className ? 1 : 0}</h2>
          </div>

          <div className="stat-card">
            <span className="icon green">📚</span>
            <p>Lectures Attended</p>
            <h2>4</h2>
          </div>

          <div className="stat-card">
            <span className="icon blue">📈</span>
            <p>Attendance</p>
            <h2>100%</h2>
          </div>
        </div>

        {/* CLASS CARD */}
        <div className="class-section">
          {loading ? (
            <p>Loading...</p>
          ) : className ? (
            <div className="class-card">
              <h3>{className}</h3>
              <p className="teacher">by Teacher</p>

              <div className="progress">
                <div className="progress-bar" style={{ width: "0%" }} />
              </div>

              <button
                className="primary-btn"
                onClick={() => navigate("/attendance")}
              >
                📸 Start Attendance
              </button>
            </div>
          ) : (
            <div className="class-card error-card">
              <h3>No Class Assigned</h3>
              <p>Please contact your teacher</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
