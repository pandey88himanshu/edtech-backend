const express = require("express");
const router = express.Router();
const { sendOTP, signUp } = require("../controllers/auth.controller");

router.get("/auth/otp", sendOTP);
router.get("/auth/signup", signUp);

module.exports = router;
