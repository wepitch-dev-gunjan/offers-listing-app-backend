const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
require('dotenv').config();
const { JWT_SECRET } = process.env;

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).send({
      error: "Please fill the required fields"
    })

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).send({
      error: "admin not found"
    })

    const passwordCheck = bcrypt.compare(password, user.password);
    if (!passwordCheck) return res.status(401).send({
      error: "Incorrect password"
    })

    const token = jwt.sign({ admin_id: admin._id }, JWT_SECRET)
    res.status(200).send({
      message: 'Logged in succesfully',
      token
    })
  } catch (error) {
    console.error(error)
  }
}

exports.adminRegister = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send({
      error: "Please fill the required fields"
    })

    const hashedPassword = bcrypt.hash(password);
    const admin = new Admin({
      username,
      password: hashedPassword
    });

    await admin.save();

    const token = jwt.sign({ admin_id: admin._id })
    res.status(200).send({
      message: 'registered succesfully',
      token
    })
  } catch (error) {
    res.status(500).send({
      error: error.message
    })
    console.error(error)
  }
}