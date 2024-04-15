const Brand = require("../models/Brand");
const uploadImage = require("../services/cloudinary");
const upload = require("../middlewares/upload");
const { uploadMultipleImages } = require("../services/cloudinary");

// cloudinary.config({
//   // cloud_name: "drqangxt5",
//   // api_key: "831579838286736",
//   // api_secret: "-Lz6ym2YT9sw2HTLm3DCJp8Lmn0",
// });

exports.postBrand = async (req, res) => {
  try {
    const { title, description, logo } = req.body;
    const { file } = req;
    // if (!file || file.length === 0) {
    //   return res.status(400).json({ error: "No file uploaded" });
    // }

    const newBrand = new Brand({ title, description, logo });
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
