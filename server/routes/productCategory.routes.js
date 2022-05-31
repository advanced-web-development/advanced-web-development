const express = require("express");

const {
  getAllProductCategories,
  getProductCategoryFromId,
  createProductCategory,
  deleteProductCategory,
  updateProductCategory,
} = require("../controllers/productCategory.controllers");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /restaurant
router.get("/", getAllProductCategories);

router.get("/:id", getProductCategoryFromId);

// POST /restaurant
router.post("/", requireAdmin, createProductCategory);

router.delete("/:id", requireAdmin, deleteProductCategory);

router.patch("/:id", requireAdmin, updateProductCategory);

module.exports = router;
