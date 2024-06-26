const express = require('express');
const { getRatings, getRating, postRating } = require('../controllers/ratingControllers');
const { userAuth } = require('../middlewares/auth');
const router = express.Router();

router.get('/rating', getRatings)
router.get('/rating/:rating_id', getRating)
router.post('/rating', userAuth, postRating)
// router.delete('/rating/:rating_id')

module.exports = router;