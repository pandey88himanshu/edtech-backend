const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      //   enum: ["Male", "Female", "Other"],
      trim: true,
    },
    dateOfBirth: {
      type: String,
      // required: [true, "Date of Birth is required"],
    },
    about: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: String,
      trim: true,
      // validate: {
      //   validator: function (value) {
      //     return /^[+]?[0-9]{10,15}$/.test(value);
      //   },
      //   message: "Please enter a valid contact number",
      // },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);
