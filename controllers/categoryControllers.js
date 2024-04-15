const Category = require("../models/Category"); // Importing the Category model

// Controller to create a new category
exports.postCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const searchName = await Category.findOne({ name });
    console.log(searchName);
    if (searchName)
      return res.status(400).send({
        error: "Category with this name is already exist ",
      });
    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get a specific category by ID
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to update a specific category by ID
exports.putCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to delete a specific category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
