const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user.model");

//auth
exports.auth = async (req, resizeBy, next) => {
  try {
    //extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer", "");

    //token validation
    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Token Not Found",
      });
    }
    //verify token
    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "token is invalid" });
    }
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Error in token Validation" });
  }
};

//is student
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for students",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "User role cannot be verified for student",
      });
  }
};

//is instructor
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for Instructor",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified for Instructor",
    });
  }
};

//is instructor
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for Admin",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified for Admin",
    });
  }
};
