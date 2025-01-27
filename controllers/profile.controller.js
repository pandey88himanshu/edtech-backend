const Profile = require("../models/profile.model");
const User = require("../models/user.model");
const { uploadToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

//update profile starts
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;
    const id = req.user.id;

    // Find the profile by id
    const userDetails = await User.findById(id);
    const profile = await Profile.findById(userDetails.additionalDetails);

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    });
    await user.save();

    // Update the profile fields
    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;

    // Save the updated profile
    await profile.save();

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
//update profile ends

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

//get all proflies starts
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
//get all proflies ends

//update display picture starts

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

//update display picture ends
