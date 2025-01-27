const express = require("express");
const router = express.Router();
const { sendOTP, signUp, login } = require("../controllers/auth.controller");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/resetPassword.controller");

router.get("/auth/otp", sendOTP);
router.post("/auth/signup", signUp);
router.post("/auth/login", login);
router.post("/auth/resetPasswordToken", resetPasswordToken);
router.post("/auth/resetPassword", resetPassword);
module.exports = router;
