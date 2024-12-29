const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema(
  {
    courseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      trim: true,
    },
    completedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CourseProgress", courseProgressSchema);
