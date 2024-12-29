const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    otp: {
      type: String,
      required: true,
      //   minlength: 4,
      //   maxlength: 6,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: 5 * 60,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Otp", otpSchema);
