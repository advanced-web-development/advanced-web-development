const express = require("express");
const {
  placeOrder,
  getAllLoggedInUserOrders,
  getAllRestaurantOrders,
  updateOrderStatus,
  getSingleOrder,
} = require("../controllers/order.controllers");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /Order
router.get("/", requireAuth, getAllLoggedInUserOrders);
router.get("/:id", requireAuth, getSingleOrder);
router.get("/restaurant", requireAuth, getAllRestaurantOrders);
router.post("/", requireAuth, placeOrder);
router.patch("/status", requireAuth, updateOrderStatus);

module.exports = router;
