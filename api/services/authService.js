const crypto = require("crypto");
const User = require("../models/User");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { messageType, client } = require("./smsService");
const Otp = require("../models/Otp");
const { JWT_SECRET } = process.env;
require("dotenv").config();

const otps = {}
exports.generateOtp = async (req, res) => {
  try {
    const { phone_number, name } = req.body;

    if (!phone_number)
      return res.status(400).send({ error: "Phone number is required" });
     let otp;

    // Check if the phone number is 9782209395
    if (phone_number === '9782209395') {
      otp = '123456'; // Send this OTP
    } else {
      // Generate a random 6-digit OTP for other numbers
      otp = Math.floor(100000 + Math.random() * 900000).toString();
    }

    // // Generate a random 4-digit OTP
    // const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP using SHA-256 for storage (optional)
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 3); // Expires in 3 minutes

    // Store the OTP in the temporary storage object
    let otpObj = await Otp.findOne({ phone_number });

    if (otpObj) {
      otpObj.expiresAt = expirationTime;
      otpObj.hashedOtp = hashedOtp;
      otpObj.attempts = 0;
    } else {
      otpObj = new Otp({
        phone_number,
        hashedOtp,
        expiresAt: expirationTime,
      });
    }

    await otpObj.save();

    const message = `OTP for login is : ${otp}`

    client.sms.message((error, responseBody) => {
      if (error === null) {
        console.log(`\nResponse body:\n${JSON.stringify(responseBody)}`);
        res.status(200).send({ ...responseBody, otp });
      } else {
        console.error('Error sending SMS:', error);
        res.status(500).send('Error sending SMS');
      }
    }, `91${phone_number}`, message, messageType)
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
    let otpObj = await Otp.findOne({ phone_number });

    if (!otpObj)
      return res.status(404).send({ error: "Phone number not found" });

    if (otpObj.attempts >= 3 || new Date() > otpObj.expiresAt) {
      // Handle cases where too many attempts or OTP expiration
      return res.status(401).send({ error: "Invalid OTP token" });
    }

    // Hash the received OTP from the client
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // Verify if the hashed OTP from the client matches the hashed OTP stored in your data storage
    if (hashedOtp !== otpObj.hashedOtp) {
      // Increment the attempts on failed verification
      otpObj.attempts++;
      await otpObj.save();
      return res.status(401).send({ error: "Invalid OTP token" });
    }

    // If OTP is valid, you can proceed with user verification
    let user = await User.findOne({ phone_no: phone_number });
    const already_registered = !!user?.name && !!user?.age;

    if (!user) {
      user = new User({
        phone_no: phone_number,
      });

      await user.save();
    }

    const { _id } = user;
    const token = jwt.sign({ user_id: _id, phone_number }, JWT_SECRET);

    // Clear the stored OTP after successful verification
    await Otp.findOneAndDelete({ phone_number });

    res.status(200).send({
      message: "OTP verified successfully",
      already_registered,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};
