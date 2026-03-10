import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student"); // student | teacher
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const url =
        role === "student"
          ? "http://localhost:5000/api/auth/student/login"
          : "http://localhost:5000/api/auth/teacher/login";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);

      if (role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/teacher/dashboard");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* NAVBAR */}
      <nav className="login-navbar">
        <div className="logo">📸 CAPTURE IT!</div>
        <div className="nav-links">
          <span className="active">Login</span>
        </div>
      </nav>

      {/* MAIN */}
      <div className="login-container">
        <div className="login-left">
          <h1>Welcome Back 👋</h1>
          <p>Automated Attendance & Monitoring System</p>
        </div>

        <div className="login-card">
          <h2>Sign In</h2>
          <p className="subtitle">Choose role and login</p>

          {/* ROLE TOGGLE */}
          <div className="role-toggle">
            <button
              className={role === "student" ? "active" : ""}
              onClick={() => setRole("student")}
            >
              👨‍🎓 Student
            </button>
            <button
              className={role === "teacher" ? "active" : ""}
              onClick={() => setRole("teacher")}
            >
              👨‍🏫 Teacher
            </button>
          </div>

          <div className="input-group">
            <span>📧</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span>🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button onClick={login} disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
