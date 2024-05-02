const Category = require("../models/Category"); // Importing the Category model

// Controller to create a new category
exports.postCategory = async (req, res) => {
  try {
    const { name, sub_categories } = req.body;
    const existingCategory = await Category.findOne({ name });

    if (existingCategory)
      return res.status(400).send({
        error: "Category with this name is already exist ",
      });

    if (!name)
      return res.status(400).send({ error: "category should not be empty" });

    const addingObject = {
      name
    }

    if (sub_categories && sub_categories.length > 0)
      addingObject.sub_categories = sub_categories;

    const newCategory = new Category(addingObject);
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
    const category = await Category.findById(req.params.category_id);
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
    if (name) {
      const checkCategory = await Category.findOne({ name });
      if (checkCategory)
        return res
          .status(400)
          .json({ error: " this named category is already present" });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.category_id,
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
    const deletedCategory = await Category.findByIdAndDelete(
      req.params.category_id
    );
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
