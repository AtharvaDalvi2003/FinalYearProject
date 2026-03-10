import React, { useEffect, useState } from "react";
import axios from "axios";
import "./teacher.css";

export default function TeacherAbsentees() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [data, setData] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/classes/my-classes",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setClasses(res.data);
  };

  const fetchAbsentees = async () => {
    if (!selectedClass) return alert("Select class");

    const res = await axios.get(
      `http://localhost:5000/api/attendance/absentees/${selectedClass}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setData(res.data);
  };

  return (
    <div className="content">
      <h2>❌ Absentees</h2>

      <select onChange={(e) => setSelectedClass(e.target.value)}>
        <option value="">Select Class</option>
        {classes.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <button onClick={fetchAbsentees}>View Absentees</button>

      {data && (
        <div className="card">
          <p>Date: {data.date}</p>
          <p>Total Students: {data.totalStudents}</p>
          <p>Present: {data.present}</p>

          <h4>Absent Students</h4>
          {data.absentees.length === 0 ? (
            <p>🎉 No absentees</p>
          ) : (
            data.absentees.map((s) => (
              <p key={s._id}>
                {s.name} ({s.email})
              </p>
            ))
          )}
        </div>
      )}
    </div>
  );
}
