const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ✅ SINGLE CLASS (IMPORTANT)
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class", // MUST MATCH model name
      default: null,
    },

    // ✅ MULTIPLE FACE IMAGES
    faceImages: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
