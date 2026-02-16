const express = require("express");
const protect = require("../middleware/protect");
const {
  createClass,
  getMyClasses,
  linkSubjectToClass,
} = require("../controllers/classController");

const router = express.Router();

router.post("/create", protect, createClass);
router.get("/my-classes", protect, getMyClasses);

// 🔗 link subject
router.post("/link-subject", protect, linkSubjectToClass);

module.exports = router;
