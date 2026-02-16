const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// ⚠️ IMPORTANT: allow multipart/form-data
app.use(express.urlencoded({ extended: true }));

// ✅ Static uploads
app.use("/uploads", express.static("uploads"));

// =====================
// ROUTES
// =====================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/classes", require("./routes/classes"));
app.use("/api/subjects", require("./routes/subjectRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working successfully 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
