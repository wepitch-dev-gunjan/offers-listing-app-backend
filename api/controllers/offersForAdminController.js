const Offer = require("../models/Offer");
const { uploadImage } = require("../services/cloudinary");

// ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// ─██████████████─██████████████─██████████████─██████████████─████████████████──────██████████████─██████████████─██████████─██████████████─
// ─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░░░░░░░██──────██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░██─██░░░░░░░░░░██─
// ─██░░██████░░██─██░░██████████─██░░██████████─██░░██████████─██░░████████░░██──────██░░██████░░██─██░░██████░░██─████░░████─██░░██████████─
// ─██░░██──██░░██─██░░██─────────██░░██─────────██░░██─────────██░░██────██░░██──────██░░██──██░░██─██░░██──██░░██───██░░██───██░░██─────────
// ─██░░██──██░░██─██░░██████████─██░░██████████─██░░██████████─██░░████████░░██──────██░░██████░░██─██░░██████░░██───██░░██───██░░██████████─
// ─██░░██──██░░██─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░░░░░░░██──────██░░░░░░░░░░██─██░░░░░░░░░░██───██░░██───██░░░░░░░░░░██─
// ─██░░██──██░░██─██░░██████████─██░░██████████─██░░██████████─██░░██████░░████──────██░░██████░░██─██░░██████████───██░░██───██████████░░██─
// ─██░░██──██░░██─██░░██─────────██░░██─────────██░░██─────────██░░██──██░░██────────██░░██──██░░██─██░░██───────────██░░██───────────██░░██─
// ─██░░██████░░██─██░░██─────────██░░██─────────██░░██████████─██░░██──██░░██████────██░░██──██░░██─██░░██─────────████░░████─██████████░░██─
// ─██░░░░░░░░░░██─██░░██─────────██░░██─────────██░░░░░░░░░░██─██░░██──██░░░░░░██────██░░██──██░░██─██░░██─────────██░░░░░░██─██░░░░░░░░░░██─
// ─██████████████─██████─────────██████─────────██████████████─██████──██████████────██████──██████─██████─────────██████████─██████████████─
// ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
exports.addOffer = async (req, res) => {
  try {
    let {
      category,
      sub_category,
      brand,
      location,
      description,
      expires_in,
      discount_value,
    } = req.body;
    const { file } = req;
    const dateFormate = new Date(expires_in);

    discount_value = parseInt(discount_value);

    // Validate required fields
    if (!description || !expires_in || !discount_value) {
      return res.status(400).send({
        error: "Description, expires_in, and discount_value are required",
      });
    }

    // Validate image
    if (!file || !file.buffer) {
      return res.status(400).send({ error: "Offer image is required" });
    }

    // Validate expires_in format
    if (!(dateFormate instanceof Date) || isNaN(dateFormate)) {
      return res
        .status(400)
        .send({ error: "Expires_in should be a valid date" });
    }

    // Validate discount_value format
    if (typeof discount_value !== "number" || discount_value <= 0) {
      return res
        .status(400)
        .send({ error: "Discount_value should be a positive number" });
    }

    // Validate description length
    if (description.length > 500) {
      return res
        .status(400)
        .send({ error: "Description should be maximum 500 characters" });
    }

    // Validate location length
    if (location && location.length > 100) {
      return res
        .status(400)
        .send({ error: "Location should be maximum 100 characters" });
    }

    // Generate a unique identifier for the image file
    const uid = Math.floor(Math.random() * 100000).toString();
    const fileName = `offer-image-${uid}`;
    const folderName = "offer-images";

    // Upload the image
    const image = await uploadImage(file.buffer, fileName, folderName);

    // Create new offer object
    const newOffer = new Offer({
      category,
      sub_category,
      brand,
      location,
      description,
      image,
      expires_in,
      discount_value,
    });

    // Save the offer to the database
    const savedOffer = await newOffer.save();

    res.status(201).json(savedOffer);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
