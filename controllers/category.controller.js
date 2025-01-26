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
    return res.status(200).json({
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

// category page details starts
exports.categoryPageDetails = async (req, res) => {
  try {
    //get category id
    const { categoryId } = req.body;
    //get courses for specified category id
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();
    //validation
    if (selectedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Data not found" });
    }
    //get courses for different category
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();
    //get top selling courses
    //return response
    return res
      .status(200)
      .json({
        success: true,
        message: "category page details found",
        data: { selectedCategory, differentCategories },
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in getting category page details",
    });
  }
};
// category page details ends
