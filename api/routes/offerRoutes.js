const express = require("express");
const {
  postOffer,
  getOffers,
  getOffer,
  putOffer,
  deleteOffer,
  saveOffer,
  unsaveOffer,
  getSavedOffers,
  grabOffer,
  grabbedOffers
} = require("../controllers/offerControllers");
const upload = require("../middlewares/uploadImage");
const { userAuth } = require("../middlewares/auth");
const router = express.Router();

router.post("/offer", upload.single('image'), postOffer);
router.get("/offer", getOffers);
router.get("/offer/:offer_id", getOffer);
router.put("/offer/:offer_id", putOffer);
router.delete("/offer/:offer_id", deleteOffer);

router.get("/saved-offers", userAuth, getSavedOffers);
router.put("/offer/:offer_id/save", userAuth, saveOffer);
router.put("/offer/:offer_id/unsave", userAuth, unsaveOffer);

router.put('/offer/:offer_id/grab', userAuth, grabOffer)
router.get('/grabbed-offers', grabbedOffers)

module.exports = router;
