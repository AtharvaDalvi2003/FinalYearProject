const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

// 📌 Mark attendance AFTER face upload success
exports.markAttendance = async (req, res) => {
  try {
    const studentId = req.user._id;

    const student = await Student.findById(studentId).populate("class");
    if (!student || !student.class) {
      return res.status(400).json({ message: "Student not assigned to class" });
    }

    const today = new Date().toISOString().split("T")[0];

    // ❌ Prevent duplicate attendance
    const alreadyMarked = await Attendance.findOne({
      student: studentId,
      date: today,
    });

    if (alreadyMarked) {
      return res.status(200).json({ message: "Attendance already marked" });
    }

    // ✅ ONLY CHANGE: add status: "Present"
    await Attendance.create({
      student: studentId,
      class: student.class._id,
      date: today,
      status: "Present",
    });

    res.json({ message: "Attendance marked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Attendance error" });
  }
};

// ✅ VIEW ABSENTEES (Teacher)
exports.getAbsenteesByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const today = new Date().toISOString().split("T")[0];

    // 1️⃣ All students in class
    const students = await Student.find({ class: classId });
    const totalStudents = students.length;

    // 2️⃣ Present students today
    const presentRecords = await Attendance.find({
      class: classId,
      date: today,
      status: "Present",
    });

    const presentStudentIds = presentRecords.map(
      (a) => a.student.toString()
    );

    // 3️⃣ Absentees = not present
    const absentees = students.filter(
      (s) => !presentStudentIds.includes(s._id.toString())
    );

    res.json({
      date: today,
      totalStudents,
      present: presentRecords.length,
      absentees,
    });
  } catch (err) {
    console.error("Absentees error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
