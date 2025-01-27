const User = require("../models/user.model");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    // Get email from req.body
    const email = req.body.email;

    // Email validation
    if (!email) {
      return res
        .status(401)
        .json({ success: false, message: "Error in getting email" });
    }

    // Check if user exists for this email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered to reset password",
      });
    }

    // Generate token
    const token = crypto.randomUUID();

    // Update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );

    // Create reset password URL
    const url = `http://localhost:4000/update-password/${token}`;

    // Email template
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #4CAF50;">Password Reset Request</h2>
        <p>Hi ${user.name || "User"},</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${url}" target="_blank" style="background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>If you did not request this password reset, please ignore this email. The link will expire in 5 minutes.</p>
        <p>Thank you,</p>
        <p><strong>Study Notion</strong></p>
        <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #777;">If you’re having trouble with the button, copy and paste the following link into your browser: <a href="${url}" target="_blank">${url}</a></p>
      </div>
    `;

    // Send email containing the template
    await mailSender(email, "Password Reset Link", emailTemplate);

    // Return response
    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error in resetPasswordToken:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error in reset password",
    });
  }
};

//reset password

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      });
    }
    const userDetails = await User.findOne({ token: token });
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is Invalid",
      });
    }
    if (!(userDetails.resetPasswordExpires > Date.now())) {
      return res.status(403).json({
        success: false,
        message: `Token is Expired, Please Regenerate Your Token`,
      });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { token: token },
      { password: encryptedPassword },
      { new: true }
    );
    res.json({
      success: true,
      message: `Password Reset Successful`,
    });
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Updating the Password`,
    });
  }
};
