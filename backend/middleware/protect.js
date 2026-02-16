const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = null;

    // Check teacher first
    user = await Teacher.findById(decoded.id);
    if (user) {
      req.user = user;
      req.role = "teacher";
      return next();
    }

    // Else check student
    user = await Student.findById(decoded.id);
    if (user) {
      req.user = user;
      req.role = "student";
      return next();
    }

    return res.status(401).json({ message: "User not found" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protect;
