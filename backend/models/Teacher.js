const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[a-zA-Z0-9._%+-]+@seamedu\.in$/, "Only seamedu.in emails allowed"],
    },
    password: { type: String, required: true },
    department: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
