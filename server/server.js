const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); //cors미들 웨이 추가

app.get("/", function (req, res) {
  res.send("Hello Node.js");
});

app.listen(5000, function () {
  console.log("Start Node Server!");
});
