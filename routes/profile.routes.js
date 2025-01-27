const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth.middleware");
const {
  updateDisplayPicture,
  updateProfile,
  getUserDetails,
} = require("../controllers/profile.controller");

router.put("/profile/updateDisplayPicture", auth, updateDisplayPicture);
router.put("/profile/updateProfile", auth, updateProfile);
router.get("/profile/getUserDetails", auth, getUserDetails);

module.exports = router;
