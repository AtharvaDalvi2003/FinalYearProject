import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Login (single shared login)
import Login from "./pages/Login";

// Student
import StudentDashboard from "./pages/student/StudentDashboard";
import FaceAttendance from "./pages/FaceAttendance";

// Teacher
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherSubjects from "./pages/teacher/TeacherSubjects";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherAbsentees from "./pages/teacher/TeacherAbsentees";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Student routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/attendance" element={<FaceAttendance />} />

        {/* Teacher routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/subjects" element={<TeacherSubjects />} />
        <Route path="/teacher/classes" element={<TeacherClasses />} />
        <Route path="/teacher/students" element={<TeacherStudents />} />
        <Route path="/teacher/absentees" element={<TeacherAbsentees />} />
      </Routes>
    </Router>
  );
}

export default App;
