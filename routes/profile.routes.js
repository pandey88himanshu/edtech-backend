const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth.middleware");
const { updateDisplayPicture } = require("../controllers/profile.controller");

router.put("/profile/updateDisplayPicture", auth, updateDisplayPicture);

module.exports = router;
