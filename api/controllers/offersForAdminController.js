const Offer = require("../models/Offer");
const User = require("../models/User");
const { uploadImage, deleteImage } = require("../services/cloudinary");

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

exports.getOffers = async (req, res) => {
  try {
    const { search, category, sort_by, brand } = req.query;
    let query = {};

    // Check if search query is provided
    if (search) {
      // Define search criteria for multiple fields
      query.$or = [
        { name: { $regex: new RegExp(search, "i") } }, // Case-insensitive search for name
        { location: { $regex: new RegExp(search, "i") } }, // Case-insensitive search for location
        { description: { $regex: new RegExp(search, "i") } }, // Case-insensitive search for description
      ];
    }

    // Check if category is provided
    if (category) {
      query.category = category;
    }

    // Check if brand is provided
    if (brand) {
      query.brand = brand;
    }

    // Define sort criteria object
    let sortCriteria = {};

    // Check if sort_by parameter is provided and set sort criteria accordingly
    if (sort_by) {
      // For descending order, set the sort criteria to -1
      sortCriteria[sort_by] = -1;
    }

    // Find offers based on the constructed query and populate category and brand
    let offers = await Offer.find(query)
      .populate("category")
      .populate("brand")
      .sort(sortCriteria);

    res.status(200).json(offers);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
exports.getOffer = async (req, res) => {
  const { offer_id } = req.params;
  try {
    // Find the offer by ID and populate related fields
    const offer = await Offer.findById(offer_id)
      .populate("category")
      .populate("brand");

    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // Fetch details of users who saved this offer
    const savedUserDetails = [];
    for (const userId of offer.saved_by) {
      const user = await User.findById(userId);
      if (user) {
        savedUserDetails.push({
          _id: user._id,
          username: user.name,
          email: user.email,
        });
      }
    }
    const grabbed_byDetails = [];
    for (const userId of offer.grabbed_by) {
      const user = await User.findById(userId);
      if (user) {
        grabbed_byDetails.push({
          _id: user._id,
          username: user.name,
          email: user.email,
        });
      }
    }
    console.log(grabbed_byDetails);

    const responseData = {
      offer,
      savedUserDetails,
      grabbed_byDetails,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
exports.putOffer = async (req, res) => {
  const { offer_id } = req.params;
  try {
    const { category, description, expires_in, discount_value } = req.body;

    // Validate request body fields
    if (!category || !description || !expires_in || !discount_value) {
      return res.status(400).send({ error: "All fields are required" });
    }

    // Validate expires_in format
    if (typeof expires_in !== "number" || expires_in <= 0) {
      return res
        .status(400)
        .send({ error: "Expires_in should be a positive number" });
    }

    // Validate discount_value format
    if (typeof discount_value !== "number" || discount_value <= 0) {
      return res
        .status(400)
        .send({ error: "Discount_value should be a positive number" });
    }

    // Validate category and description length
    if (category.length > 100 || description.length > 500) {
      return res.status(400).send({
        error:
          "Category should be maximum 100 characters and description maximum 500 characters",
      });
    }

    // Find the offer by its ID
    const existingOffer = await Offer.findById(offer_id);

    // If the offer is not found, return a 404 error
    if (!existingOffer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // Delete previous image if it exists
    if (existingOffer.image) {
      // Assuming there's a deleteImage function to delete the image
      await deleteImage(existingOffer.image);
    }

    // Check if a new image is included in the request
    if (req.file && req.file.buffer) {
      const uid = Math.floor(Math.random() * 100000).toString();
      const fileName = `offer-image-${uid}`;
      const folderName = "offer-images";

      // Upload the new image
      const image = await uploadImage(req.file.buffer, fileName, folderName);

      // Update the offer with the new image
      existingOffer.image = image;
    }

    // Update other fields of the offer
    existingOffer.category = category;
    existingOffer.description = description;
    existingOffer.expires_in = expires_in;
    existingOffer.discount_value = discount_value;

    // Save the updated offer
    const updatedOffer = await existingOffer.save();

    // Respond with the updated offer
    res.status(200).json(updatedOffer);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteOffer = async (req, res) => {
  const { offer_id } = req.params;
  try {
    // Find the offer by its ID
    const existingOffer = await Offer.findById(offer_id);

    // If the offer is not found, return a 404 error
    if (!existingOffer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // Delete the offer's image if it exists
    if (existingOffer.image) {
      // Assuming there's a deleteImage function to delete the image
      await deleteImage(existingOffer.image);
    }

    // Delete the offer document from the database
    await existingOffer.deleteOne();

    // Respond with success message
    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
