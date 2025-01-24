const express = require("express");
const router = express.Router();
const { sendOTP, signUp, login } = require("../controllers/auth.controller");

router.get("/auth/otp", sendOTP);
router.post("/auth/signup", signUp);
router.post("/auth/login", login);

module.exports = router;
