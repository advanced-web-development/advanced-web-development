const express = require("express");
const {
  placeOrder,
  getAllLoggedInUserOrders,
  getAllRestaurantOrders,
} = require("../controllers/order.controllers");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /Order
router.get("/", requireAuth, getAllLoggedInUserOrders);
router.get("/restaurant", requireAuth, getAllRestaurantOrders);
router.post("/", requireAuth, placeOrder);

module.exports = router;
