const express = require("express");

const {
  getAllProductCategories,
  getProductCategoryFromId,
  createProductCategory,
  deleteProductCategory,
  updateProductCategory,
} = require("../controllers/productCategory.controllers");

const router = express.Router();

// GET /restaurant
router.get("/", getAllProductCategories);

router.get("/:id", getProductCategoryFromId);

// POST /restaurant
router.post("/", createProductCategory);

router.delete("/:id", deleteProductCategory);

router.patch("/:id", updateProductCategory);

module.exports = router;
