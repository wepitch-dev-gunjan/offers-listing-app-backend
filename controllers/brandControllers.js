const Brand = require('../models/Brand'); // Importing the Brand model

// Controller to create a new brand
exports.postBrand = async (req, res) => {
  try {
    const { title, description, logo, redirect_link } = req.body;
    const newBrand = new Brand({ title, description, logo, redirect_link });
    const savedBrand = await newBrand.save();
    res.status(201).json(savedBrand);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

// Controller to get all brands
exports.getBrands = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    query = {
      $or: [
        { title: { $regex: new RegExp(search, 'i') } }, // Case-insensitive search for name
        { description: { $regex: new RegExp(search, 'i') } } // Case-insensitive search for description
      ]
    };

    const brands = await Brand.find(query);
    res.status(200).json(brands);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

// Controller to get a specific brand by ID
exports.getBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.status(200).json(brand);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

// Controller to update a specific brand by ID
exports.putBrand = async (req, res) => {
  try {
    const { title, description, logo, redirect_link } = req.body;
    const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, { title, description, logo, redirect_link }, { new: true });
    if (!updatedBrand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.status(200).json(updatedBrand);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

// Controller to delete a specific brand by ID
exports.deleteBrand = async (req, res) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
