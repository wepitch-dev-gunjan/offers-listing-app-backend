const homePageBanner = require("../models/homePageBanner");

var cloudinary = require("cloudinary").v2;

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

const uploadImage = (imageBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(opts, async (error, result) => {
        try {
          if (result && result.secure_url) {
            const newBanner = new homePageBanner({
              url: result.secure_url,
            });
            await newBanner.save();
            // create a banner document and store the url
            return resolve(result.secure_url);
          }
        } catch (error) {
          console.log(error);
        }

        console.log(error.message);
        return reject({ message: error.message });
      })
      .end(imageBuffer);
  });
};

module.exports = (image) => {
  //imgage = > base64
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        console.log(result.secure_url);
        return resolve(result.secure_url);
      }
      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};

module.exports.uploadMultipleImages = (images) => {
  return new Promise((resolve, reject) => {
    const uploads = images.map((base) => uploadImage(base));
    Promise.all(uploads)
      .then((values) => resolve(values))
      .catch((err) => reject(err));
  });
};

module.exports = uploadImage;
