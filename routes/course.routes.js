const express = require("express");
const router = express.Router();

const {
  createCategory,
  showAllCategory,
} = require("../controllers/category.controller");

const {
  createCourse,
  getCourseDetails,
} = require("../controllers/course.controller");
const { createSection } = require("../controllers/section.controller");
const { createSubSection } = require("../controllers/subSection.controller");
const {
  auth,
  isAdmin,
  isInstructor,
} = require("../middlewares/auth.middleware");

router.post("/course/createCategory", auth, isAdmin, createCategory);
router.get("/course/showAllCategory", showAllCategory);
router.post("/course/createCourse", auth, isInstructor, createCourse);
router.post("/course/createSection", auth, isInstructor, createSection);
router.post("/course/createSubSection", auth, isInstructor, createSubSection);
router.post("/course/getCourseDetails", getCourseDetails);
module.exports = router;
