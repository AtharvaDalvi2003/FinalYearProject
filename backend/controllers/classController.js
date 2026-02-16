const Class = require("../models/Class");
const Student = require("../models/Student");

// CREATE CLASS
exports.createClass = async (req, res) => {
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
exports.getMyClasses = async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.user._id })
      .populate("subject", "name")
      .populate("students", "name rollNumber email");

    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔗 LINK SUBJECT WITH CLASS
exports.linkSubjectToClass = async (req, res) => {
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

// 👨‍🎓 ASSIGN STUDENT TO CLASS
exports.assignStudentToClass = async (req, res) => {
  try {
    const { classId, studentId } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const updatedClass = await Class.findOneAndUpdate(
      { _id: classId, teacher: req.user._id },
      { $addToSet: { students: studentId } }, // prevents duplicates
      { new: true }
    ).populate("students", "name rollNumber email");

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json({
      message: "Student assigned to class successfully",
      class: updatedClass,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👀 VIEW STUDENTS IN A CLASS
exports.getStudentsInClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const classData = await Class.findOne({
      _id: classId,
      teacher: req.user._id,
    }).populate("students", "name rollNumber email");

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(classData.students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
