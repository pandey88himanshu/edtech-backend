const Category = require("../models/category.model");

//create category handler

exports.createCategory = async (req, res) => {
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
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    //return res
    return res
      .status(200)
      .json({
        success: true,
        message: "Category created successfully",
        categoryDetails,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "error in creating Category" });
  }
};

//get all category
exports.showAllCategory = async (req, res) => {
  try {
    //get all tags from db
    const allCategory = await Category.find(
      {},
      { name: true, description: true }
    );
    //validation
    if (!allCategory) {
      return res
        .status(403)
        .json({ success: false, message: "Error in Finding all Category" });
    }
    //return res
    return res.status(200).json({
      success: true,
      message: "All Category Found Successfully",
      allCategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "error in getting all Category" });
  }
};
