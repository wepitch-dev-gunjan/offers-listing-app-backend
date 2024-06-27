const Offer = require("../models/Offer");
const Category = require("../models/Category");
const { deleteImage, uploadImage } = require("../services/cloudinary");

// Controller to create a new offer
exports.postOffer = async (req, res) => {
  try {
    let {
      category,
      sub_category,
      brand,
      location,
      description,
      expires_in,
      discount_value
    } = req.body;
    const { file } = req;
    const dateFormate = new Date(expires_in)
    console.log(dateFormate)

    discount_value = parseInt(discount_value)

    // Validate required fields
    if (!description || !expires_in || !discount_value) {
      return res.status(400).send({ error: "Description, expires_in, and discount_value are required" });
    }

    // Validate image
    if (!file || !file.buffer) {
      return res.status(400).send({ error: "Offer image is required" });
    }

    // Validate expires_in format
    if (!(dateFormate instanceof Date) || isNaN(dateFormate)) {
      return res.status(400).send({ error: "Expires_in should be a valid date" });
    }

    // Validate discount_value format
    if (typeof discount_value !== "number" || discount_value <= 0) {
      return res.status(400).send({ error: "Discount_value should be a positive number" });
    }

    // Validate description length
    if (description.length > 500) {
      return res.status(400).send({ error: "Description should be maximum 500 characters" });
    }

    // Validate location length
    if (location && location.length > 100) {
      return res.status(400).send({ error: "Location should be maximum 100 characters" });
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
      discount_value
    });

    // Save the offer to the database
    const savedOffer = await newOffer.save();

    res.status(201).json(savedOffer);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};


// Controller to get all offers
exports.getOffers = async (req, res) => {
  try {
    const { search, category, sort_by, brand } = req.query;
    let query = {};

    // Check if search query is provided
    if (search) {
      // Define search criteria for multiple fields
      query = {
        $or: [
          { name: { $regex: new RegExp(search, "i") } }, // Case-insensitive search for name
          { location: { $regex: new RegExp(search, "i") } }, // Case-insensitive search for location
          { description: { $regex: new RegExp(search, "i") } }, // Case-insensitive search for description
        ]
      };
    }

    if (category) {
      const categoryDoc = await Category.findOne({ _id: category })
      if (categoryDoc) query.category = categoryDoc._id
    }

    if (brand) query.brand = brand;

    let sortCriteria = {}; // Define sort criteria object

    // Check if sort_by parameter is provided and set sort criteria accordingly
    if (sort_by) {
      // For descending order, set the sort criteria to -1
      sortCriteria[sort_by] = -1;
    }

    let offers = [];

    // Find offers based on the constructed query and populate category and brand
    if (Object.keys(sortCriteria).length !== 0) {
      // If sort criteria is provided, sort the offers accordingly
      offers = await Offer.find(query)
        .populate("category")
        .populate("brand")
        .sort(sortCriteria);
    } else {
      // If no sort criteria is provided, just populate category and brand without sorting
      offers = await Offer.find(query)
        .populate("category")
        .populate("brand");
    }

    res.status(200).json(offers);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};


// Controller to get a specific offer by ID
exports.getOffer = async (req, res) => {
  const { offer_id } = req.params;
  try {
    const offer = await Offer.findById(req.params.offer_id)
      .populate("category")
      .populate("brand");
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }
    res.status(200).json(offer);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to update a specific offer by ID
exports.putOffer = async (req, res) => {
  const { offer_id } = req.params;
  try {
    const {
      category,
      description,
      expires_in,
      discount_value,
    } = req.body;

    // Validate request body fields
    if (!category || !description || !expires_in || !discount_value) {
      return res.status(400).send({ error: "All fields are required" });
    }

    // Validate expires_in format
    if (typeof expires_in !== "number" || expires_in <= 0) {
      return res.status(400).send({ error: "Expires_in should be a positive number" });
    }

    // Validate discount_value format
    if (typeof discount_value !== "number" || discount_value <= 0) {
      return res.status(400).send({ error: "Discount_value should be a positive number" });
    }

    // Validate category and description length
    if (category.length > 100 || description.length > 500) {
      return res.status(400).send({
        error: "Category should be maximum 100 characters and description maximum 500 characters"
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

// Controller to delete a specific offer by ID
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

exports.saveOffer = async (req, res) => {
  try {
    const { user_id } = req;
    const { offer_id } = req.params;
    const offer = await Offer.findOne({ _id: offer_id });

    // console.log(user_id, offer_id)

    if (!offer) return res.status(404).send({
      error: "No offer found"
    })

    if (offer.saved_by.includes(user_id)) {
      return res.status(400).send({
        error: "You are already saved this offer"
      })
    }

    offer.saved_by.push(user_id);

    await offer.save();
    res.status(200).send({
      message: "Offer saved successfully",
      data: {
        following: true
      }
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.unsaveOffer = async (req, res) => {
  try {
    const { user_id } = req;
    const { offer_id } = req.params;
    const offer = await Offer.findOne({ _id: offer_id });

    if (!offer.saved_by.includes(user_id)) {
      return res.status(400).send({
        error: "You haven't saved this offer yet"
      })
    }

    // Remove user_id from the saved_by array
    offer.saved_by = offer.saved_by.filter(savedUser => {
      return savedUser.toString() !== user_id.toString()
    });

    await offer.save();
    res.status(200).send({
      message: "Offer unsaved successfully",
      data: {
        following: false
      }
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.getSavedOffers = async (req, res) => {
  try {
    const { user_id } = req;

    const savedOffers = await Offer.find({ saved_by: { $in: user_id } });
    if (!savedOffers) return res.status(200).send([])

    res.status(200).send(savedOffers)
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.grabOffer = async (req, res) => {
  try {
    const { user_id } = req;
    const { offer_id } = req.params;

    const offer = await Offer.findOne({ _id: offer_id });
    if (!offer) return res.status(404).send({
      error: "Offer not found"
    })

    if (offer.grabbed_by.includes(user_id)) return res.status(400).send({
      error: "User already grabbed this offer"
    })
    offer.grabbed_by.push(user_id)

    offer.save()

    res.status(200).send({
      message: 'offer grabbed successfully'
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

