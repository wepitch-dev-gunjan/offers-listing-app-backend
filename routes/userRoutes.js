const express = require('express')
const { postUser, getUsers, getUser, putUser, deleteUser } = require('../controllers/userControllers')
const upload = require('../middlewares/uploadImage')
const { generateOtp, verifyOtp } = require('../services/authService')
const router = express.Router()

router.post('/otp', generateOtp)
router.put('/otp', verifyOtp);

router.post('/user', postUser)
router.get('/user', getUsers)
router.get('/user/:user_id', getUser)
router.put('/user/:user_id', upload.single('profile_pic'), putUser)
router.delete('/user/:user_id', deleteUser)

module.exports = router