const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const {  getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const sharp = require('sharp')
require('dotenv').config()


const bucketName = process.env.BUCKET_NAME
const region = process.env.BUCKET_REGION
const accessKeyId = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  }
})



 async function uploadImage(imageBuffer, imageName, mimetype) {
    // Create params that the S3 client will use to upload the image


    const params = {
      Bucket: bucketName,
      Key: imageName,
      Body: imageBuffer,
      ContentType: mimetype
    }
  
    // Upload the image to S3
    const command = new PutObjectCommand(params)
    const data = await s3Client.send(command)
  
    return data
};
  


//...

 async function getSignUrl(fileName) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName
  })

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 * 24 })

  return signedUrl
};

 async function deleteFile(imageName) {
    // Create params that the S3 client will use to delete the image
    const params = {
      Bucket: bucketName,
      Key: imageName,
    };
  
    // Delete the image from S3
    const command = new DeleteObjectCommand(params);
    const data = await s3Client.send(command);
    return data;
  }

  module.exports = {
    uploadImage,
    getSignUrl,
    deleteFile,

  };
  