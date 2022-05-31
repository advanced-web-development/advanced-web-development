const express = require("express");
const {
  getAllProducts,
  getProductFromId,
  createProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/product.controllers");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /product
router.get("/", getAllProducts);

router.get("/:id", getProductFromId);

// POST /product
router.post("/", requireAdmin, createProduct);

router.delete("/:id", requireAdmin, deleteProduct);

router.patch("/:id", requireAdmin, updateProduct);

module.exports = router;
