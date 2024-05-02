const Offer = require("../models/Offer");
const Category = require("../models/Category");

// Controller to create a new offer
exports.postOffer = async (req, res) => {
  try {
    const { name, location, description, expire_at, discount_value } =
      req.body;

    const { file } = req;

    if (!file) return res.status(400).send({
      error: "Offer image is required"
    })

    const uid = Math.floor(Math.random() * 100000).toString(); // Fixing the random number generation
    const fileName = `offer-image-${uid}`;
    const folderName = "offer-images";
    const image = await uploadImage(file.buffer, fileName, folderName); // Assuming uploadImage function is defined elsewhere

    const newOffer = new Offer({
      name,
      location,
      description,
      image,
      expire_at,
      discount_value
    });
    const savedOffer = await newOffer.save();
    res.status(201).json(savedOffer);
  } catch (error) {
    console.log(error);
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
      name,
      category,
      brand,
      location,
      description,
      image,
      expire_at,
      discount_value,
    } = req.body;
    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.offer_id,
      {
        name,
        category,
        brand,
        location,
        description,
        image,
        expire_at,
        discount_value,
      },
      { new: true }
    );
    if (!updatedOffer) {
      return res.status(404).json({ error: "Offer not found" });
    }
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
    const deletedOffer = await Offer.findOneAndDelete({
      _id: req.params.offer_id,
    });
    if (!deletedOffer) {
      return res.status(404).json({ error: "Offer not found" });
    }
    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
