const express = require("express");
const app = express();
const auth = require("./routes/auth.routes");
require("./config/database");
app.use(express.json());
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
app.listen(3000, () => {
  console.log("app is running on port 3000");
});
