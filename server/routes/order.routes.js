const express = require("express");
const {
  placeOrder,
  getAllLoggedInUserOrders,
  getAllRestaurantOrders,
  updateOrderStatus,
  getSingleOrder,
  finalCheckout,
} = require("../controllers/order.controllers");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /Order
router.get("/", requireAuth, getAllLoggedInUserOrders);
router.get("/:id", requireAuth, getSingleOrder);
router.get("/restaurant", requireAuth, getAllRestaurantOrders);
router.post("/", requireAuth, placeOrder);
router.post("/checkout", requireAuth, finalCheckout);
router.patch("/status", requireAdmin, updateOrderStatus);

module.exports = router;
