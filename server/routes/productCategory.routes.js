const express = require("express");

const {
  getAllProductCategories,
  getProductCategoryFromId,
  createProductCategory,
  deleteProductCategory,
  updateProductCategory,
} = require("../controllers/productCategory.controllers");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /restaurant
router.get("/", requireAuth, getAllProductCategories);

router.get("/:id", requireAuth, getProductCategoryFromId);

// POST /restaurant
router.post("/", requireAuth, createProductCategory);

router.delete("/:id", requireAuth, deleteProductCategory);

router.patch("/:id", requireAuth, updateProductCategory);

module.exports = router;
