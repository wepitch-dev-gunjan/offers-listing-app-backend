const crypto = require("crypto");
const User = require("../models/User");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { messageType, client } = require("./smsService");
const { JWT_SECRET } = process.env;
require("dotenv").config();

const otps = {}
exports.generateOtp = async (req, res) => {
  try {
    const { phone_number, name } = req.body;

    if (!phone_number)
      return res.status(400).send({ error: "Phone number is required" });

    // Generate a random 4-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP using SHA-256 for storage (optional)
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 3); // Expires in 3 minutes

    // Store the OTP in the temporary storage object
    otps[phone_number] = {
      otp: hashedOtp || otp,
      expiresAt: expirationTime,
      attempts: 0,
    };

    // Schedule the removal of this OTP after 3 minutes
    setTimeout(() => {
      delete otps[phone_number];
    }, 5 * 60 * 1000); // 3 minutes in milliseconds

    const message = `OTP for login is : ${otp}`

    client.sms.message((error, responseBody) => {
      if (error === null) {
        console.log("\nResponse body:\n" + JSON.stringify(responseBody));
        res.status(200).send({ ...responseBody, otp });
      } else {
        console.error('Error sending SMS:', error);
        res.status(500).send('Error sending SMS');
      }
    }, '91' + phone_number, message, messageType)
    // You may want to send the OTP to the user via SMS or other means here
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone_number, otp } = req.body;

    // Check if the provided OTP matches the one stored in memory
    const storedOtp = otps[phone_number];

    if (!storedOtp || storedOtp.otp !== crypto.createHash("sha256").update(otp).digest("hex")) {
      // Handle cases where OTP doesn't match or phone number is not found
      storedOtp.attempts++;
    }

    if (storedOtp.attepts >= 3) return res.status(403).send({
      error: 'Invalid otp, please try again'
    })


    if (new Date() > storedOtp.expiresAt) {
      // Handle case where OTP has expired
      delete otps[phone_number]; // Remove expired OTP
      return res.status(401).send({ error: "OTP has expired" });
    }

    // If OTP is valid, you can proceed with user verification
    let user = await User.findOne({ phone_no: phone_number });
    const already_registered = !!user;

    if (!user) {
      user = new User({
        phone_no: phone_number,
        verified: true,
      });

      await user.save();
    }

    const { _id } = user;
    const token = jwt.sign({ user_id: _id, phone_number }, JWT_SECRET);

    // Clear the stored OTP after successful verification
    delete otps[phone_number];

    console.log(otps)

    res.status(200).send({
      message: "OTP verified successfully",
      already_registered,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};