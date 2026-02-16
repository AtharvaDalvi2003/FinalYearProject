const express = require("express");
const router = express.Router();

const {
  createSubject,
  getTeacherSubjects,
} = require("../controllers/subjectController");

const teacherAuth = require("../middleware/teacherAuth");

router.post("/create", teacherAuth, createSubject);
router.get("/my-subjects", teacherAuth, getTeacherSubjects);

module.exports = router;
