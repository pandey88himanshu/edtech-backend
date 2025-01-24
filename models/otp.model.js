const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

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

//function to send email

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email From Ed-Tech",
      otp
    );
    console.log("Email Send Successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending mails: ", error);
  }
}

otpSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("Otp", otpSchema);
