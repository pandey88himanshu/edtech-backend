const mongoose = require("mongoose");
require("dotenv").config();

const mongodbUrl = process.env.MONGO_URL;

if (!mongodbUrl) {
  console.error("MongoDB URL not provided in environment variables.");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongodbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
