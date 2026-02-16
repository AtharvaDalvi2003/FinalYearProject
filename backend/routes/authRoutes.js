const express = require("express");
const {
  registerStudent,
  loginStudent,
  loginTeacher,
  registerTeacher,
} = require("../controllers/authController");

const router = express.Router();

// STUDENT
router.post("/student/register", registerStudent);
router.post("/student/login", loginStudent);

// TEACHER
router.post("/teacher/register", registerTeacher);
router.post("/teacher/login", loginTeacher);

module.exports = router;
