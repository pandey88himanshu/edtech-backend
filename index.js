const express = require("express");
const app = express();
require("./config/database");
require("dotenv").config();

const auth = require("./routes/auth.routes");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
cloudinaryConnect();

app.use("/api/v1", auth);
app.get("/", (req, res) => {
  res.send("This is home page");
});
app.get("/test", (req, res) => {
  res.send("This is a test Api");
});
app.get("*", (req, res) => {
  res.send("Api doesnot exists");
});
app.listen(process.env.PORT, () => {
  console.log("app is running on port 3000");
});
