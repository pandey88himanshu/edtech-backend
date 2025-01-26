const RatingAndReview = require("../models/ratingAndReviews.model");
const Course = require("../models/course.model");
const { default: mongoose } = require("mongoose");

//create review and rating starts
exports.createRating = async (req, res) => {
  try {
    //get user id
    const userId = req.user.id;
    //fetch data from req body
    const { rating, review, courseId } = req.body;
    //check user enroled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnroled: { $elemMatch: { $eq: userId } },
    });
    if (!courseDetails) {
      return res
        .status(401)
        .json({ success: false, message: "Student is not enroled in course" });
    }
    //check user alerady reviewed or not
    const aleradyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (aleradyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewed by the user",
      });
    }
    //create rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });
    //update the course with rating and review
    await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: { ratingAndReviews: ratingReview._id },
      },
      { new: true }
    );
    //return res
    return res.status(201).json({
      success: true,
      message: "RAting created successfully",
      ratingReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in creating review and ratings",
    });
  }
};
//create review and rating ends

// get avg rating starts
exports.getAverageRating = async (req, res) => {
  try {
    //get course id
    const courseId = req.body.courseId;
    //calculate avg rating
    const result = await RatingAndReview.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      { $group: { _id: null, avgerageRating: { $avg: "$rating" } } },
    ]);
    // return rating
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Success in avg rating",
        avgerageRating: result[0].avgerageRating,
      });
    }
    //if no rating reviews exist
    return res.status(200).json({
      success: true,
      message: "Avg rating is 0 , no rating given till now",
      avgerageRating: 0,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in getting avg ratings" });
  }
};
// get avg rating ends

// get all rating stats
exports.getAllRatingAndReviews = async (req, res) => {
  try {
    const allReviews = (await RatingAndReview.find({}))
      .sort({ rating: "desc" })
      .populate({ path: "user", select: "firstName lastName email image" })
      .populate({ path: "course", select: "courseName" })
      .exec();
    return res
      .status(200)
      .json({
        success: true,
        message: "All reviews fetched succesfully",
        data: allReviews,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in getting all reviews" });
  }
};
// get all rating ends
