const multer = require("multer");

const storage = multer.memoryStorage(); // Use memory storage for handling file uploads

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
}); // Accept multiple files with field name 'images' and limit to 10 files

module.exports = upload;
