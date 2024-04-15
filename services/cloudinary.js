const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

const options = {
  use_filename: true,
  unique_filename: true,
  overwrite: false,
};

exports.uploadImage = async (imageBuffer, filename, folderName) => {
  try {
    const options = {
      folder: folderName,
      public_id: filename.substring(0, filename.lastIndexOf(".")), // Set public_id to the filename without extension
      unique_filename: false,
    };

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(options, (error, result) => {
          if (error) {
            console.error(error);
            reject(error);
          } else {
            console.log(result);
            resolve(result.secure_url);
          }
        })
        .end(imageBuffer);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deleteImage = async (url) => {
  try {
    return await cloudinary.uploader.destroy(url);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
