// const User = require('../models/User'); // Importing the User model

// // Controller to create a new user
// exports.postUser = async (req, res) => {
//   try {
//     const { name, phone_no, email, location, age, gender } = req.body;
//     const newUser = new User({ name, phone_no, email, location, age, gender });
//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error: 'Internal Server Error' });
//   }
// };

// // Controller to get all users
// exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error: 'Internal Server Error' });
//   }
// };

// // Controller to get a specific user by ID
// exports.getUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error: 'Internal Server Error' });
//   }
// };

// // Controller to update a specific user by ID
// exports.putUser = async (req, res) => {
//   try {
//     const { name, phone_no, email, location, age, gender } = req.body;
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, phone_no, email, location, age, gender }, { new: true });
//     if (!updatedUser) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error: 'Internal Server Error' });
//   }
// };

// // Controller to delete a specific user by ID
// exports.deleteUser = async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id);
//     if (!deletedUser) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error: 'Internal Server Error' });
//   }
// };
