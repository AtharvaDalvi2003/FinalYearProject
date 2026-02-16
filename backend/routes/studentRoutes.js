const express = require("express");
const protect = require("../middleware/protect");
const {
  getMyProfile,
  uploadFaceImage,
  getStudentsByClass,
} = require("../controllers/studentController");
const Student = require("../models/Student");

const router = express.Router();

/**
 * GET logged-in student profile
 * /api/students/me
 */
router.get("/me", protect, getMyProfile);

/**
 * POST upload face image
 * /api/students/upload-face
 */
router.post("/upload-face", protect, uploadFaceImage);

/**
 * ✅ GET students by class (USED BY TEACHER)
 * /api/students/class/:classId
 */
router.get("/class/:classId", protect, getStudentsByClass);

/**
 * POST assign student to class
 * /api/students/assign-class
 */
router.post("/assign-class", protect, async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    if (!studentId || !classId) {
      return res.status(400).json({ message: "studentId and classId required" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.class = classId;
    await student.save();

    res.json({ message: "Student assigned to class successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Assign class failed" });
  }
});

module.exports = router;
