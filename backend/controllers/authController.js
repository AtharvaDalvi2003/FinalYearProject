const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// =======================
// STUDENT REGISTER
// =======================
exports.registerStudent = async (req, res) => {
  try {
    const { name, rollNumber, email, password } = req.body;

    const exists = await Student.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Student.create({
      name,
      rollNumber,
      email,
      password: hashedPassword,
    });

    res.json({ message: "Student registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// STUDENT LOGIN
// =======================
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(student._id, "student"),
      user: student,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// TEACHER REGISTER
// =======================
// TEACHER REGISTER
exports.registerTeacher = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    const exists = await Teacher.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      name,
      email,
      password: hashedPassword,
      department,
    });

    res.status(201).json({
      message: "Teacher registered successfully",
      id: teacher._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =======================
// TEACHER LOGIN
// =======================
exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(teacher._id, "teacher"),
      user: teacher,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
