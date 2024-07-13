const User = require("../models/User");
const { uploadImage } = require("../services/cloudinary");

//
// ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
// █░░░░░░██░░░░░░█░░░░░░░░░░░░░░█░░░░░░░░░░░░░░█░░░░░░░░░░░░░░░░██████░░░░░░░░░░░░░░█░░░░░░░░░░░░░░█░░░░░░░░░░█░░░░░░░░░░░░░░█
// █░░▄▀░░██░░▄▀░░█░░▄▀▄▀▄▀▄▀▄▀░░█░░▄▀▄▀▄▀▄▀▄▀░░█░░▄▀▄▀▄▀▄▀▄▀▄▀░░██████░░▄▀▄▀▄▀▄▀▄▀░░█░░▄▀▄▀▄▀▄▀▄▀░░█░░▄▀▄▀▄▀░░█░░▄▀▄▀▄▀▄▀▄▀░░█
// █░░▄▀░░██░░▄▀░░█░░▄▀░░░░░░░░░░█░░▄▀░░░░░░░░░░█░░▄▀░░░░░░░░▄▀░░██████░░▄▀░░░░░░▄▀░░█░░▄▀░░░░░░▄▀░░█░░░░▄▀░░░░█░░▄▀░░░░░░░░░░█
// █░░▄▀░░██░░▄▀░░█░░▄▀░░█████████░░▄▀░░█████████░░▄▀░░████░░▄▀░░██████░░▄▀░░██░░▄▀░░█░░▄▀░░██░░▄▀░░███░░▄▀░░███░░▄▀░░█████████
// █░░▄▀░░██░░▄▀░░█░░▄▀░░░░░░░░░░█░░▄▀░░░░░░░░░░█░░▄▀░░░░░░░░▄▀░░██████░░▄▀░░░░░░▄▀░░█░░▄▀░░░░░░▄▀░░███░░▄▀░░███░░▄▀░░░░░░░░░░█
// █░░▄▀░░██░░▄▀░░█░░▄▀▄▀▄▀▄▀▄▀░░█░░▄▀▄▀▄▀▄▀▄▀░░█░░▄▀▄▀▄▀▄▀▄▀▄▀░░██████░░▄▀▄▀▄▀▄▀▄▀░░█░░▄▀▄▀▄▀▄▀▄▀░░███░░▄▀░░███░░▄▀▄▀▄▀▄▀▄▀░░█
// █░░▄▀░░██░░▄▀░░█░░░░░░░░░░▄▀░░█░░▄▀░░░░░░░░░░█░░▄▀░░░░░░▄▀░░░░██████░░▄▀░░░░░░▄▀░░█░░▄▀░░░░░░░░░░███░░▄▀░░███░░░░░░░░░░▄▀░░█
// █░░▄▀░░██░░▄▀░░█████████░░▄▀░░█░░▄▀░░█████████░░▄▀░░██░░▄▀░░████████░░▄▀░░██░░▄▀░░█░░▄▀░░███████████░░▄▀░░███████████░░▄▀░░█
// █░░▄▀░░░░░░▄▀░░█░░░░░░░░░░▄▀░░█░░▄▀░░░░░░░░░░█░░▄▀░░██░░▄▀░░░░░░████░░▄▀░░██░░▄▀░░█░░▄▀░░█████████░░░░▄▀░░░░█░░░░░░░░░░▄▀░░█
// █░░▄▀▄▀▄▀▄▀▄▀░░█░░▄▀▄▀▄▀▄▀▄▀░░█░░▄▀▄▀▄▀▄▀▄▀░░█░░▄▀░░██░░▄▀▄▀▄▀░░████░░▄▀░░██░░▄▀░░█░░▄▀░░█████████░░▄▀▄▀▄▀░░█░░▄▀▄▀▄▀▄▀▄▀░░█
// █░░░░░░░░░░░░░░█░░░░░░░░░░░░░░█░░░░░░░░░░░░░░█░░░░░░██░░░░░░░░░░████░░░░░░██░░░░░░█░░░░░░█████████░░░░░░░░░░█░░░░░░░░░░░░░░█
// ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

exports.getUsersForAdmin = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) return res.status(404).send({ message: "No user Found" });
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
  }
};
exports.getUserForAdmin = async (req, res) => {
  const { user_id } = req.params;
  try {
    if (!user_id) return res.staus(400).send({ error: "No user Id found" });
    const userData = await User.findById(user_id);
    if (!userData)
      return res.staus(404).send({ message: "No User data found" });
    return res.status(200).send(userData);
  } catch (error) {
    console.log(error);
  }
};
exports.editUserForAdmin = async (req, res) => {
  try {
    const { name, phone_no, email, location, age, gender } = req.body;
    const { file } = req;
    const { user_id } = req.params;

    const editObject = {};

    if (file) {
      const uid = Math.floor(Math.random() * 100000).toString(); // Fixing the random number generation
      const fileName = `user-profile-pic-${uid}`;
      const folderName = "user-profile-pics";
      const url = await uploadImage(file.buffer, fileName, folderName);
      editObject.profile_pic = url;
    }

    if (phone_no) {
      const checkPhoneNo = await User.findOne({ phone_no });
      if (checkPhoneNo)
        return res
          .status(400)
          .json({ error: "This Phone Number is already used" });
      editObject.phone_no = phone_no;
    }

    if (email) {
      const checkEmail = await User.findOne({ email });
      if (checkEmail)
        return res.status(400).json({ error: "This email is already used" });
      editObject.email = email;
    }

    if (name) editObject.name = name;
    if (age) editObject.age = age;
    if (gender) editObject.gender = gender;
    if (location) editObject.location = location;

    const updatedUser = await User.findByIdAndUpdate(user_id, editObject, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
exports.deleteUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(user_id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
