const express = require("express");
const {
  getAllProducts,
  getProductFromId,
  createProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/product.controllers");

const router = express.Router();

// GET /restaurant
router.get("/", getAllProducts);

router.get("/:id", getProductFromId);

// POST /restaurant
router.post("/", createProduct);

router.delete("/:id", deleteProduct);

router.patch("/:id", updateProduct);

module.exports = router;
