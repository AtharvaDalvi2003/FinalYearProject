const express = require("express");
const protect = require("../middleware/protect");
const {
  getAbsenteesByClass,
} = require("../controllers/attendanceController");

const router = express.Router();

router.get("/absentees/:classId", protect, getAbsenteesByClass);

module.exports = router;
