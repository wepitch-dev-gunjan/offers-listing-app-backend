const express = require("express");
const {
  postCategory,
  getCategories,
  getCategory,
  putCategory,
  deleteCategory,
} = require("../controllers/categoryControllers");
const upload = require("../middlewares/uploadImage");
const router = express.Router();

router.post("/category", upload.single("image"), postCategory);
router.get("/category", getCategories);
router.get("/category/:category_id", getCategory);
router.put("/category/:category_id", putCategory);
router.delete("/category/:category_id", deleteCategory);

module.exports = router;
