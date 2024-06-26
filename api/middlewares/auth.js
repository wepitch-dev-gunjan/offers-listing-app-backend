const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
require("dotenv").config();

exports.userAuth = async (req, res, next) => {
  try {
    const token = req.headers['authorization']; // Corrected 'Authorization' to 'authorization'
    console.log(token)
    let decoded = ""
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (!token || !decoded) {
        return res.status(401).send({ error: 'Unauthorized' }); // Return 401 if token is missing
      }
    }

    if (!token || !decoded) {
      return res.status(401).send({ error: 'Unauthorized' }); // Return 401 if token is missing
    }

    req.user_id = decoded.user_id;
    req.phone_number = decoded.phone_number;

    next(); // Call next() to proceed to the next middleware
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
