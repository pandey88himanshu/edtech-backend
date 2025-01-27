const User = require("../models/user.model");
const OTP = require("../models/otp.model");
const Profile = require("../models/profile.model");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpTemplate = require("../mail/templates/emailVerificationTemplate");
require("dotenv").config();
//send otp starts
exports.sendOTP = async (req, res) => {
  try {
    // Fetch email from the request body
    const { email } = req.body;

    // Check if the user already exists
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    // Generate OTP
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("Generated OTP:", otp);

    // Check for unique OTP
    let otpExists = await OTP.findOne({ otp });
    while (otpExists) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      otpExists = await OTP.findOne({ otp });
    }

    // Create OTP entry in the database
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP saved to DB:", otpBody);

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use any email service
      auth: {
        user: process.env.MAIL_USER, // Your email
        pass: process.env.MAIL_PASS, // Your app password
      },
    });

    // Prepare email content
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your OTP for StudyNotion",
      html: otpTemplate(otp), // Use the HTML template
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return response
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error in sending OTP:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

//send otp ends

//sign up starts
exports.signUp = async (req, res) => {
  try {
    //fetch data from body
    const { firstName, lastName, email, password, accountType, otp } = req.body;
    //validate
    if (!firstName || !lastName || !email || !password || !otp) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      });
    }
    //user exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    //find most recent otp stored for user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);

    //validate otp
    if (!recentOtp || recentOtp.length == 0) {
      return res.status(400).json({ success: false, message: "otp not found" });
    }
    if (otp !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid Otp",
      });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //entry in db
    //creating profile
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
      additionalDetails: profileDetails._id,
    });
    //return res
    return res
      .status(201)
      .json({ success: true, message: "user registered successfully", user });
  } catch (error) {
    console.log("Error in Signup", error.message);
  }
};
//sign up ends
//login start
exports.login = async (req, res) => {
  try {
    //fetch data from body
    const { email, password } = req.body;
    //validate data
    if (!email || !password) {
      return res
        .status(403)
        .json({ success: false, message: "all fields are required" });
    }
    //user exists or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user not found please create account",
      });
    }
    //generate jwt after matching password
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      //create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Password is in correct" });
    }
  } catch (error) {
    console.log("error in login", error.message);
  }
};
//login ends
//change pasword starts
exports.changePassword = async (req, res) => {
  try {
    //get the data from the body
    //get old pass , new pass
    //validation
    //update pass in db
    //send mail password updated
    //send res
  } catch (error) {
    console.log("error in changing the password", error.message);
  }
};
//change pasword ends
