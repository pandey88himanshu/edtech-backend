const Course = require("../models/course.model");
const Tag = require("../models/tags.model");
const User = require("../models/user.model");
const { uploadToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();
//create course starts
exports.createCourse = async (req, res) => {
  try {
    //fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;
    //get thumbnail
    const thumbnail = req.files.thumbnailImage;
    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res
        .status(401)
        .json({ success: false, message: "All Fileds are required" });
    }
    //check instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    if (!instructorDetails) {
      return res
        .status(404)
        .json({ success: false, message: "instructor details not found" });
    }
    //check given tag is valid or not
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res
        .status(404)
        .json({ success: false, message: "tag details not found" });
    }
    //upload to cloudinary
    const thumbnailImage = await uploadToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    //cerate an entry in db for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });
    //add the new course to the user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );
    //update tag schema
    //return res
    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "error in creating course" });
  }
};
//create course ends

//get all courses
exports.showAllCourses = async (req, res) => {
  try {
    //get all courses
    const allCourses = await Course.find({});
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Cannot get course data" });
  }
};
