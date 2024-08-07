const Offer = require("../models/Offer");
const Category = require("../models/Category");
const User = require("../models/User");
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
      discount_value,
    } = req.body;
    const { file } = req;
    const dateFormate = new Date(expires_in);
    console.log(dateFormate);

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

// Controller to get all offers
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

exports.getHomeScreenOffers = async (req, res) => {
  try {
    let offers = await Offer.aggregate([{ $sample: { size: 10 } }]);

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
      console.log(user);
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

// Controller to update a specific offer by ID
exports.putOffer = async (req, res) => {
 const { offer_id } = req.params;
 try {
   const { category, description, expires_in, discount_value, amount } = req.body;

   // Validate the amount field if it is present
   if (amount !== undefined) {
     if (typeof amount !== "number" || amount <= 0) {
       return res
         .status(400)
         .send({ error: "Amount should be a positive number" });
     }
   }

   // Find the offer by its ID
   const existingOffer = await Offer.findById(offer_id);

   // If the offer is not found, return a 404 error
   if (!existingOffer) {
     return res.status(404).json({ error: "Offer not found" });
   }

   // Update only the fields that are present in the request body
   if (category !== undefined) {
     if (category.length > 100) {
       return res.status(400).send({
         error: "Category should be maximum 100 characters",
       });
     }
     existingOffer.category = category;
   }

   if (description !== undefined) {
     if (description.length > 500) {
       return res.status(400).send({
         error: "Description should be maximum 500 characters",
       });
     }
     existingOffer.description = description;
   }

   if (expires_in !== undefined) {
     if (typeof expires_in !== "number" || expires_in <= 0) {
       return res
         .status(400)
         .send({ error: "Expires_in should be a positive number" });
     }
     existingOffer.expires_in = expires_in;
   }

   if (discount_value !== undefined) {
     if (typeof discount_value !== "number" || discount_value <= 0) {
       return res
         .status(400)
         .send({ error: "Discount_value should be a positive number" });
     }
     existingOffer.discount_value = discount_value;
   }

   if (amount !== undefined) {
     existingOffer.amount = amount;
   }

   // Check if a new image is included in the request
   if (req.file && req.file.buffer) {
     const uid = Math.floor(Math.random() * 100000).toString();
     const fileName = `offer-image-${uid}`;
     const folderName = "offer-images";

     // Upload the new image
     const image = await uploadImage(req.file.buffer, fileName, folderName);

     // Delete previous image if it exists
     if (existingOffer.image) {
       // Assuming there's a deleteImage function to delete the image
       await deleteImage(existingOffer.image);
     }

     // Update the offer with the new image
     existingOffer.image = image;
   }

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

    if (!offer)
      return res.status(404).send({
        error: "No offer found",
      });

    if (offer.saved_by.includes(user_id)) {
      return res.status(400).send({
        error: "You are already saved this offer",
      });
    }

    offer.saved_by.push(user_id);

    await offer.save();
    res.status(200).send({
      message: "Offer saved successfully",
      data: {
        following: true,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.unsaveOffer = async (req, res) => {
  try {
    const { user_id } = req;
    const { offer_id } = req.params;
    const offer = await Offer.findOne({ _id: offer_id });

    if (!offer.saved_by.includes(user_id)) {
      return res.status(400).send({
        error: "You haven't saved this offer yet",
      });
    }

    // Remove user_id from the saved_by array
    offer.saved_by = offer.saved_by.filter((savedUser) => {
      return savedUser.toString() !== user_id.toString();
    });

    await offer.save();
    res.status(200).send({
      message: "Offer unsaved successfully",
      data: {
        following: false,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getSavedOffers = async (req, res) => {
  try {
    const { user_id } = req;

    const savedOffers = await Offer.find({ saved_by: { $in: user_id } });
    if (!savedOffers) return res.status(200).send([]);

    res.status(200).send(savedOffers);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.grabOffer = async (req, res) => {
  try {
    const { user_id } = req;
    const { offer_id } = req.params;

    const offer = await Offer.findOne({ _id: offer_id });
    if (!offer)
      return res.status(404).send({
        error: "Offer not found",
      });

    if (offer.grabbed_by.includes(user_id))
      return res.status(400).send({
        error: "User already grabbed this offer",
      });
    offer.grabbed_by.push(user_id);

    offer.save();

    res.status(200).send({
      message: "offer grabbed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.grabbedOffers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const offers = await Offer.find().skip(skip);
    const response = [];
    offers.map((offer) => {
      offer.grabbed_by.map(async (user_id) => {
        const user = await User.findOne({ _id: user_id });
        const grabbedOffer = {
          grabbed_by: user.name,
          offer: offer.name,
          amount: offer.amount,
        };
        response.push(grabbedOffer);
      });
    });

    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
