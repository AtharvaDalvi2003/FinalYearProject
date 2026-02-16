const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

/* ======================
   MULTER CONFIG
====================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const studentId = req.user._id.toString();

    const dir = path.join(
      process.cwd(),
      "backend",
      "uploads",
      "students",
      studentId
    );

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `face_${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

/* ======================
   CONTROLLERS
====================== */

// ✅ GET LOGGED-IN STUDENT PROFILE
const getMyProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .populate("class", "name");

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// ✅ FACE UPLOAD + ATTENDANCE
const uploadFaceImage = (req, res) => {
  upload.single("images")(req, res, async (err) => {
    try {
      if (err || !req.file) {
        return res.status(400).json({ message: "Upload error" });
      }

      const student = await Student.findById(req.user._id).populate("class");

      if (!student || !student.class) {
        return res
          .status(400)
          .json({ message: "Student not assigned to any class" });
      }

      const today = new Date().toISOString().split("T")[0];

      const alreadyMarked = await Attendance.findOne({
        student: student._id,
        date: today,
      });

      if (!alreadyMarked) {
        await Attendance.create({
          student: student._id,
          class: student.class._id,
          date: today,
          status: "Present",
          method: "Face",
        });
      }

      student.faceImages = student.faceImages || [];
      student.faceImages.push(req.file.path);
      await student.save();

      res.json({ message: "Attendance marked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
};

// ✅ GET STUDENTS BY CLASS (FOR TEACHER)
const getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const students = await Student.find({ class: classId })
      .populate("class", "name")
      .select("name email class");

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

// ✅ EXPORTS (IMPORTANT)
module.exports = {
  getMyProfile,
  uploadFaceImage,
  getStudentsByClass,
};
