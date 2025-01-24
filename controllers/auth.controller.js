const User = require("../models/user.model");
const OTP = require("../models/otp.model");
const Profile = require("../models/profile.model");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
//send otp starts
exports.sendOTP = async (req, res) => {
  try {
    //fetch email
    const { email } = req.body;
    //checking user exists
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }
    //generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log(otp);
    //check unique otp or not
    const otpExists = await OTP.findOne({ otp: otp });
    while (otpExists) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      otpExists = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    //create entry in db for otp
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);
    //return respon
    res.status(200).json({
      success: true,
      message: "otp sent successfull",
      otp,
    });
  } catch (error) {
    console.log("Error in sending otp", error.message);
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
