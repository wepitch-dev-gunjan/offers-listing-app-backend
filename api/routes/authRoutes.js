const express = require("express");
const { adminLogin, adminRegister } = require("../controllers/authControllers");
const router = express.Router();

router.post("/login", adminLogin);
router.post("/register", adminRegister);

module.exports = router;
