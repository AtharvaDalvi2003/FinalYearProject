import React, { useEffect, useState } from "react";
import axios from "axios";
import "./teacher.css";

function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/classes/my-classes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClasses(res.data || []);
    } catch (err) {
      console.error("Failed to load classes", err);
    }
  };

  // ✅ FIXED ENDPOINT
  const fetchStudents = async (classId) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `http://localhost:5000/api/classes/${classId}/students`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setStudents(res.data || []);
  } catch (err) {
    console.error("Failed to load students", err);
    setStudents([]);
  } finally {
    setLoading(false);
  }
};


  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setStudents([]);

    if (classId) {
      fetchStudents(classId);
    }
  };

  return (
    <div className="content">
      <h2>👨‍🎓 Students</h2>

      <select value={selectedClass} onChange={handleClassChange}>
        <option value="">Select Class</option>
        {classes.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      {loading && <p>Loading students...</p>}

      {!loading && selectedClass && students.length === 0 && (
        <p>No students found</p>
      )}

      {students.map((s) => (
        <div className="card" key={s._id}>
          <h4>{s.name}</h4>
          <p>{s.email}</p>
          <p>
            Class:{" "}
            {typeof s.class === "object" && s.class?.name
              ? s.class.name
              : "Assigned"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default TeacherStudents;
