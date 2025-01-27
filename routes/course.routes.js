const express = require("express");
const router = express.Router();

const {
  createCategory,
  showAllCategory,
} = require("../controllers/category.controller");
const { auth, isAdmin } = require("../middlewares/auth.middleware");

router.post("/course/createCategory", auth, isAdmin, createCategory);
router.get("/course/showAllCategory", auth, isAdmin, showAllCategory);

module.exports = router;
