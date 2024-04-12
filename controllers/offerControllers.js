const Offer = require('../models/Offer'); // Importing the Offer model

// Controller to create a new offer
exports.postOffer = async (req, res) => {
  try {
    const { name, location, description, image, expire_at, discount_value } = req.body;
    const newOffer = new Offer({ name, location, description, image, expire_at, discount_value });
    const savedOffer = await newOffer.save();
    res.status(201).json(savedOffer);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

// Controller to get all offers
exports.getOffers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    // Check if search query is provided
    if (search) {
      // Define search criteria for multiple fields
      query = {
        $or: [
          { name: { $regex: new RegExp(search, 'i') } }, // Case-insensitive search for name
          { location: { $regex: new RegExp(search, 'i') } }, // Case-insensitive search for location
          { description: { $regex: new RegExp(search, 'i') } } // Case-insensitive search for description
        ]
      };
    }

    // Find offers based on the constructed query and populate category and brand
    const offers = await Offer.find(query).populate('category').populate('brand');
    res.status(200).json(offers);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};


// Controller to get a specific offer by ID
exports.getOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.offer_id).populate('category').populate('brand');
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    res.status(200).json(offer);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

// Controller to update a specific offer by ID
exports.putOffer = async (req, res) => {
  try {
    const { name, category, brand, location, description, image, expire_at, discount_value } = req.body;
    const updatedOffer = await Offer.findByIdAndUpdate(req.params.offer_id, { name, category, brand, location, description, image, expire_at, discount_value }, { new: true });
    if (!updatedOffer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    res.status(200).json(updatedOffer);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

// Controller to delete a specific offer by ID
exports.deleteOffer = async (req, res) => {
  try {
    const deletedOffer = await Offer.findOneAndDelete({ _id: req.params.offer_id });
    if (!deletedOffer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    res.status(200).json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
