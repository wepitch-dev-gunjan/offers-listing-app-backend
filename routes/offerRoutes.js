const express = require('express')
const { postOffer, getOffers, getOffer, putOffer, deleteOffer } = require('../controllers/offerControllers')
const router = express.Router()

router.post('/offer', postOffer)
router.get('/offer', getOffers)
router.get('/offer/:offer_id', getOffer)
router.put('/offer/:offer_id', putOffer)
router.delete('/offer/:offer_id', deleteOffer)


module.exports = router