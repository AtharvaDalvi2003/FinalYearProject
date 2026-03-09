const Class = require("../models/Class");
const Student = require("../models/Student");

// CREATE CLASS
const createClass = async (req, res) => {
  try {
    const { name } = req.body;

    const newClass = await Class.create({
      name,
      teacher: req.user._id,
    });

    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET TEACHER CLASSES
const getMyClasses = async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.user._id })
      .populate("subject", "name")
      .populate("students", "name email");

    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LINK SUBJECT WITH CLASS
const linkSubjectToClass = async (req, res) => {
  try {
    const { classId, subjectId } = req.body;

    const updatedClass = await Class.findOneAndUpdate(
      { _id: classId, teacher: req.user._id },
      { subject: subjectId },
      { new: true }
    ).populate("subject", "name");

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(updatedClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👨‍🎓 ASSIGN STUDENT TO CLASS (FINAL – DO NOT CHANGE)
const assignStudentToClass = async (req, res) => {
  try {
    const { classId, studentId } = req.body;

    if (!classId || !studentId) {
      return res.status(400).json({ message: "classId and studentId required" });
    }

    // 1️⃣ Update Student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.class = classId;
    await student.save();

    // 2️⃣ Update Class
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $addToSet: { students: studentId } },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json({ message: "Student assigned to class successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Assign class failed" });
  }
};

// 👀 VIEW STUDENTS IN CLASS
const getStudentsInClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const classData = await Class.findOne({
      _id: classId,
      teacher: req.user._id,
    }).populate("students", "name email");

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(classData.students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ EXPORTS (VERY IMPORTANT)
module.exports = {
  createClass,
  getMyClasses,
  linkSubjectToClass,
  assignStudentToClass,
  getStudentsInClass,
};
