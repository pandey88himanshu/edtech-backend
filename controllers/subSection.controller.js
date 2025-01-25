const SubSection = require("../models/subSection.model");
const Section = require("../models/section.model");
const { uploadToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();
//create section

exports.createSubSection = async (req, res) => {
  try {
    //fetch data
    const { sectionId, title, timeDuration, description } = req.body;
    // extract file/Video
    const video = req.files.videoFile;
    //validation
    if (!sectionId || !title || !timeDuration || !description) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are required" });
    }
    //upload video to cloudinary
    const uplaodDetails = await uploadToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    //create a sub section
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uplaodDetails.secure_url,
    });
    //upload section with this sub section object id
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: subSectionDetails._id } },
      { new: true }
    );
    //lg updated sectin after populating
    //return res
    return res
      .status(200)
      .json({
        success: true,
        message: "Section created successfully",
        updatedSection,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in creating sub section" });
  }
};
