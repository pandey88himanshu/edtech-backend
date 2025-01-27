const SubSection = require("../models/subSection.model");
const Section = require("../models/section.model");
const Course = require("../models/course.model");
const { uploadToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

exports.createSubSection = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { sectionId, title, description, courseId, timeDuration } = req.body;
    const video = req.files.video;

    // Check if all necessary fields are provided
    if (
      !sectionId ||
      !title ||
      !description ||
      !video ||
      !courseId ||
      !timeDuration
    ) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields are Required" });
    }

    // Check if the section exists
    const ifsection = await Section.findById(sectionId);
    if (!ifsection) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    // Upload the video file to Cloudinary
    const uploadDetails = await uploadToCloudinary(
      video,
      process.env.FOLDER_VIDEO
    );

    // Create a new sub-section with the necessary information
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate("subSection");

    // Populate the course with its sections and sub-sections
    const updatedCourse = await Course.findById(courseId)
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec();

    // Return the updated course in the response
    return res.status(200).json({ success: true, data: updatedCourse });
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
