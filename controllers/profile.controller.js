const Profile = require("../models/profile.model");
const User = require("../models/user.model");
const { uploadToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();
exports.updateProfile = async (req, res) => {
  try {
    //get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    //get user id
    const id = req.user.id;
    //validation
    if (!contactNumber || !gender || !id) {
      return res
        .status(403)
        .json({ success: false, message: "All Fileds are required" });
    }
    //find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);
    //update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();
    //return res
    return res.status(200).json({
      success: true,
      message: "Profile Updated successfully",
      profileDetails,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "error in updating profile" });
  }
};

//delete account
//explore schedule this deletion -- cron job
exports.deleteAccount = async (req, res) => {
  try {
    //get id
    const id = req.user.id;
    //validate
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    //delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    //delete user
    await User.findByIdAndDelete({ _id: id });
    //unenroll user from enrolled courses
    //return response
    return res
      .status(200)
      .json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "error in deleting profile" });
  }
};

//get all proflies
exports.getUserDetails = async (req, res) => {
  try {
    //get id
    const id = req.user.id;
    //validatin
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    //return res
    return res.status(200).json({
      success: true,
      message: "User Data Fetched Successfully",
      userDetails,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "error in geting all profile" });
  }
};

//update display picture

exports.updateDisplayPicture = async (req, res) => {
  try {
    // Ensure the user is authenticated and user ID is present
    const userId = req.user?.id; // Safely access `req.user.id`
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Check if the display picture file exists
    const displayPicture = req.files?.displayPicture;
    if (!displayPicture) {
      return res.status(400).json({
        success: false,
        message: "No display picture uploaded",
      });
    }

    // Upload the image to Cloudinary
    const image = await uploadToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image upload failed",
      });
    }

    // Update user profile with the new image URL
    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error in updateDisplayPicture:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
