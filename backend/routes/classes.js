const express = require("express");
const protect = require("../middleware/protect");

const {
  createClass,
  getMyClasses,
  linkSubjectToClass,
  assignStudentToClass,
  getStudentsInClass,
} = require("../controllers/classController");

const router = express.Router();

// CREATE CLASS
router.post("/create", protect, createClass);

// GET TEACHER CLASSES  ✅ THIS WAS BREAKING
router.get("/my-classes", protect, getMyClasses);

// LINK SUBJECT TO CLASS
router.post("/link-subject", protect, linkSubjectToClass);

// ASSIGN STUDENT TO CLASS
router.post("/assign-student", protect, assignStudentToClass);

// VIEW STUDENTS IN A CLASS
router.get("/:classId/students", protect, getStudentsInClass);

module.exports = router;
