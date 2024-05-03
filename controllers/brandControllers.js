const Brand = require("../models/Brand");
const { uploadImage } = require("../services/cloudinary");

exports.postBrand = async (req, res) => {
  try {
    const { title, description, redirect_link } = req.body;
    const { file } = req;

    if (!file) return res.status(400).send({
      error: "Brand logo is required"
    })

    const editObject = {}
    const uid = Math.floor(Math.random() * 100000).toString(); // Fixing the random number generation
    const fileName = `brand-logo-${uid}`;
    const folderName = "brand-logos";
    const url = await uploadImage(file.buffer, fileName, folderName); // Assuming uploadImage function is defined elsewhere
    editObject.logo = url;
    editObject.title = title;
    editObject.description = description;
    editObject.redirect_link = redirect_link;

    const newBrand = new Brand(editObject);
    const savedBrand = await newBrand.save();

    res.status(201).json(savedBrand);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get all brands
exports.getBrands = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    query = {
      $or: [
        { title: { $regex: new RegExp(search, "i") } }, // Case-insensitive search for name
        { description: { $regex: new RegExp(search, "i") } }, // Case-insensitive search for description
      ],
    };

    const brands = await Brand.find(query);
    res.status(200).json(brands);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get a specific brand by ID
exports.getBrand = async (req, res) => {
  const { brand_id } = req.params;
  try {
    const brand = await Brand.findById(brand_id);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.status(200).json(brand);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to update a specific brand by ID
exports.putBrand = async (req, res) => {
  const { brand_id } = req.params;
  try {
    const { title, description, logo, redirect_link } = req.body;
    const updatedBrand = await Brand.findByIdAndUpdate(
      brand_id,
      { title, description, logo, redirect_link },
      { new: true }
    );
    if (!updatedBrand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.status(200).json(updatedBrand);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to delete a specific brand by ID
exports.deleteBrand = async (req, res) => {
  const { brand_id } = req.params;
  console.log(brand_id);
  try {
    const deletedBrand = await Brand.findByIdAndDelete(brand_id);
    if (!deletedBrand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.addStore = async (req, res) => {
  try {
    const { brand_id } = req.params;
    const { name, location, rating } = req.body;

    // Validate input fields
    if (!name || !location || !rating) {
      return res.status(400).json({ error: "Name, location, and rating are required" });
    }

    const store = {
      name,
      location,
      rating
    };

    const brand = await Brand.findOne({ _id: brand_id });
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    brand.stores.push(store);
    await brand.save();

    res.status(200).send({ message: "Store added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const { brand_id, store_id } = req.params;

    // Validate input fields
    if (!store_id) {
      return res.status(400).json({ error: "Store ID is required" });
    }

    const brand = await Brand.findOne({ _id: brand_id });
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    // Find the index of the store in the brand's stores array
    const storeIndex = brand.stores.findIndex(store => store._id.toString() === store_id);

    // Check if the store exists in the brand's stores array
    if (storeIndex === -1) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Remove the store from the brand's stores array
    brand.stores.splice(storeIndex, 1);

    await brand.save();

    res.status(200).send({ message: "Store deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.editStore = async (req, res) => {
  try {
    const { brand_id, store_id } = req.params;
    const { name, location, rating } = req.body;

    // Validate input fields
    if (!store_id || !name || !location || !rating) {
      return res.status(400).json({ error: "Store ID, name, location, and rating are required" });
    }

    const brand = await Brand.findOne({ _id: brand_id });
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    // Find the index of the store in the brand's stores array
    const storeIndex = brand.stores.findIndex(store => store._id.toString() === store_id);

    // Check if the store exists in the brand's stores array
    if (storeIndex === -1) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Update store information
    brand.stores[storeIndex].name = name;
    brand.stores[storeIndex].location = location;
    brand.stores[storeIndex].rating = rating;

    await brand.save();

    res.status(200).send({ message: "Store updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};


