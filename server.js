
const crypto = require('crypto');

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const fileNames = generateFileName()


require("dotenv").config();
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const database = require("./database");
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const s3 = require('./s3')

const app = express();


app.use(express.json());
app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.send("HELP ME -MP");
});


app.get("/api/images", async (req, res) => {
  const images = await database.getImages()

  // Add the signed url to each image
  for (const image of images) {
    image.imageURL = await s3.getSignUrl(image.file_name)
  }

  res.send(images)
})




app.get("/api/images/:imageName", (req, res) => {
  // do a bunch of if statements to make sure the user is
  // authorized to view this image, then

  const imageName = req.params.imageName;
  const readStream = fs.createReadStream(`images/${imageName}`);
  readStream.pipe(res);
});

app.post("/api/images", upload.single('image'), async (req, res) => {
  // Get the data from the post request
  
  const description = req.body.description
  const fileBuffer = req.file.buffer
  const mimetype = req.file.mimetype
  const fileName = generateFileName();

 

  // Store the image in s3
  const s3Result = await s3.uploadImage(fileBuffer, fileName, mimetype)
  console.log(s3Result)

  // Store the image in the database
  const result = await database.addImage(fileName, description)

  res.status(201).send(result)
})

app.post("/api/images/delete", async (req, res) => {
  const key = req.body.file_name;

  // delete image from s3
  const s3Result = await s3.deleteFile(key);

  // delete image from database
  const databaseResult = await database.deleteImage(key);

  res.status(200).send(s3Result);
});

app.listen(8080, () => console.log("listening on port 8080"));
