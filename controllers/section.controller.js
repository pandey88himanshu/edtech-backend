const Section = require("../models/section.model");
const Course = require("../models/course.model");

//create section
exports.createSection = async (req, res) => {
  try {
    //data fetch
    const { sectionName, courseId } = req.body;
    //validate
    if (!sectionName || !courseId) {
      return res
        .status(401)
        .json({ success: false, message: "All fields are required" });
    }
    //create section
    const newSection = await Section.create({ sectionName });
    //update course with section object id
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newSection._id } },
      { new: true }
    );
    //use populate to replace section and sub sectin with content
    //return response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in creating section" });
  }
};

//update section

exports.updateSection = async (req, res) => {
  try {
    //data fetch
    const { sectionName, sectionId } = req.body;
    //data validation
    if (!sectionName || !sectionId) {
      return res
        .status(401)
        .json({ success: false, message: "All fields are required" });
    }
    //update data
    const newSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    //return res
    return res
      .status(200)
      .json({ success: true, message: "Section updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in updating section" });
  }
};

//delet section

exports.deleteSection = async (req, res) => {
  try {
    //get id
    const { sectionId } = req.params;
    //find by id and delete
    await Section.findByIdAndDelete(sectionId);
    //need to delete the entry from the schema of course
    //return response
    return res
      .status(200)
      .json({ success: true, message: "Sectioin Deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in deleting section" });
  }
};
