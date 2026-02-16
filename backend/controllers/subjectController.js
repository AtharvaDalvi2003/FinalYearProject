const Subject = require("../models/Subject");

exports.createSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode } = req.body;

    if (!subjectName || !subjectCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Subject.findOne({ subjectCode });
    if (existing) {
      return res.status(400).json({ message: "Subject already exists" });
    }

    const subject = await Subject.create({
      subjectName,
      subjectCode,
      createdBy: req.teacher._id,
    });

    res.status(201).json({
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTeacherSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({
      createdBy: req.teacher._id,
    });

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
