require("dotenv").config();
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const database = require("./database");
const upload = multer({ dest: "images/" });
const app = express();

app.use(express.json());
app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.send("hi");
});

app.get("/api/images", async (req, res) => {
  const response = await database.getImages();
  res.send(response);
});

app.get("/api/images/:imageName", (req, res) => {
  // do a bunch of if statements to make sure the user is
  // authorized to view this image, then

  const imageName = req.params.imageName;
  const readStream = fs.createReadStream(`images/${imageName}`);
  readStream.pipe(res);
});

app.post("/api/images", upload.single("image"), async (req, res) => {
  const imagePath = req.file.path;
  const description = req.body.description;

  // Save this data to a database probably
  const response = await database.addImage(imagePath, description);

  console.log(response);

  res.send({ description, imagePath });
});

app.listen(8080, () => console.log("listening on port 8080"));
