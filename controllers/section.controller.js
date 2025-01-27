const Section = require("../models/section.model");
const Course = require("../models/course.model");

//create section starts
exports.createSection = async (req, res) => {
  try {
    // Extract the required properties from the request body
    const { sectionName, courseId } = req.body;

    // Validate the input
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required properties",
      });
    }

    const ifcourse = await Course.findById(courseId);
    if (!ifcourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Create a new section with the given name
    const newSection = await Section.create({ sectionName });

    // Add the new section to the course's content array
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        // populate: {
        //   path: "SubSection",
        // },
      })
      .exec();

    // Return the updated course object in the response
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
//section create end
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
