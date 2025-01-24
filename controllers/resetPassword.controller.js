const User = require("../models/user.model");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcryptjs");
//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from rwq body
    const email = req.body.email;
    //email validation
    if (!email) {
      return res
        .status(401)
        .json({ success: false, message: "error in getting email" });
    }
    //check user for this email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered to reset password",
      });
    }
    //generate token
    const token = crypto.randomUUID();
    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );
    //create url
    //   const url = 'frontend url'
    //send mail contqaing the url
    await mailSender(
      email,
      "Password Reset Link",
      `Password reset link ${url}`
    );
    //return response
    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Error in reset password",
    });
  }
};

//reset password

exports.resetPassword = async (req, res) => {
  try {
    //data fetch
    const { password, token } = req.body;
    //validatin
    if (!password || !token) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid creditenials" });
    }
    //get userdetails from db using token
    const userDetails = await user.findOne({ token: token });
    //if no entry -- invalid token
    if (!userDetails) {
      return res
        .status(401)
        .json({ success: false, message: "Token is not present" });
    }
    //token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res
        .status(403)
        .json({ success: false, message: "token is expired" });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //password update
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );
    //return res
    return res
      .status(200)
      .json({ success: true, message: "Password Reset Successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Password Reset Error" });
  }
};
