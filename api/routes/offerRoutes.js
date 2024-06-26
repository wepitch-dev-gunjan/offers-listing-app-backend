const express = require("express");
const {
  postOffer,
  getOffers,
  getOffer,
  putOffer,
  deleteOffer,
  saveOffer,
  unsaveOffer
} = require("../controllers/offerControllers");
const upload = require("../middlewares/uploadImage");
const { userAuth } = require("../middlewares/auth");
const router = express.Router();

router.post("/offer", upload.single('image'), postOffer);
router.get("/offer", getOffers);
router.get("/offer/:offer_id", getOffer);
router.put("/offer/:offer_id", putOffer);
router.delete("/offer/:offer_id", deleteOffer);

router.put("/offer/:offer_id/save", userAuth, saveOffer);
router.put("/offer/:offer_id/unsave", userAuth, unsaveOffer);

module.exports = router;
