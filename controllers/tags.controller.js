const Tag = require("../models/tags.model");

//create tag handler

exports.createTag = async (req, res) => {
  try {
    //fetch data
    const { name, description } = req.body;
    //validation
    if (!name || !description) {
      return res
        .status(401)
        .json({ success: false, message: "All Fields are required" });
    }
    //create entry in db
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    //return res
    return res
      .status(200)
      .json({ success: true, message: "tag created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "error in creating tag" });
  }
};

//get all tags
exports.showAllTags = async (req, res) => {
  try {
    //get all tags from db
    const allTags = await Tag.find({}, { name: true, description: true });
    //validation
    if (!allTags) {
      return res
        .status(403)
        .json({ success: false, message: "Error in Finding all tags" });
    }
    //return res
    return res
      .status(200)
      .json({ success: true, message: "All Tags Found Successfully", allTags });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "error in getting all tag" });
  }
};
