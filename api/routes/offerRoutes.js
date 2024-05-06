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
const router = express.Router();

router.post("/offer", upload.single('image'), postOffer);
router.get("/offer", getOffers);
router.get("/offer/:offer_id", getOffer);
router.put("/offer/:offer_id", putOffer);
router.delete("/offer/:offer_id", deleteOffer);

router.put("/offer/:offer_id/save", saveOffer);
router.put("/offer/:offer_id/unsave", unsaveOffer);

module.exports = router;
