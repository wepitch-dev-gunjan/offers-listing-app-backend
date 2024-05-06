const express = require("express");
const {
  postBrand,
  getBrands,
  getBrand,
  putBrand,
  deleteBrand,
  addStore,
  editStore,
  deleteStore
} = require("../controllers/brandControllers");
const upload = require("../middlewares/uploadImage");
const router = express.Router();

// brand routes
router.post("/brand", upload.single('logo'), postBrand);
router.get("/brand", getBrands);
router.get("/brand/:brand_id", getBrand);
router.put("/brand/:brand_id", putBrand);
router.delete("/brand/:brand_id", deleteBrand);

// store routes
router.post("/brand/:brand_id/store", addStore);
router.put("/brand/:brand_id/store/:store_id", editStore);
router.delete("/brand/:brand_id/store/:store_id", deleteStore);
module.exports = router;
