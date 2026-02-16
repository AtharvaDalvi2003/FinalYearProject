const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");

const teacherAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const teacher = await Teacher.findById(decoded.id).select("-password");

    if (!teacher) {
      return res.status(401).json({ message: "User not found" });
    }

    req.teacher = teacher;
    next();
  } catch (error) {
    console.error("Teacher Auth Error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = teacherAuth;
