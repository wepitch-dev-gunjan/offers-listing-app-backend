const User = require("../models/User"); // Importing the User model

// Controller to create a new user
exports.postUser = async (req, res) => {
  try {
    const { name, phone_no, email, location, age, gender } = req.body;
    console.log(phone_no, email);
    if (!phone_no || !email) {
      return res
        .status(400)
        .send({ error: "Contact details and Email are required" });
    }
    if (phone_no) {
      const checkPhone_no = await User.findOne({ phone_no });
      if (checkPhone_no)
        return res
          .status(400)
          .json({ error: "this  Phone Number is already present" });
    }
    if (email) {
      const checkEmail = await User.findOne({ email });
      if (checkEmail)
        return res
          .status(400)
          .json({ error: " this  email is already present" });
    }

    const newUser = new User({ name, phone_no, email, location, age, gender });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get a specific user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to update a specific user by ID
exports.putUser = async (req, res) => {
  try {
    const { name, phone_no, email, location, age, gender } = req.body;
    if (phone_no) {
      const checkPhone_no = await User.findOne({ phone_no });
      if (checkPhone_no)
        return res
          .status(400)
          .json({ error: "this  Phone Number is alreadu used" });
    }
    if (email) {
      const checkEmail = await User.findOne({ email });
      if (checkEmail)
        return res.status(400).json({ error: " this  email is already used" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.user_id,
      { name, phone_no, email, location, age, gender },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to delete a specific user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.user_id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
