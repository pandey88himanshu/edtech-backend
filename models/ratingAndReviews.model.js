const mongoose = require("mongoose");

const ratingAndReviewsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      // min: 1,
      // max: 5,
    },
    review: {
      type: String,
      trim: true,
      // maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RatingAndReviews", ratingAndReviewsSchema);
