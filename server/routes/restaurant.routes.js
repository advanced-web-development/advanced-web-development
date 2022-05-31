const express = require("express");
const {
  getAllRestaurants,
  getRestaurantFromId,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurant.controllers");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /restaurant
router.get("/", getAllRestaurants);

router.get("/:id", getRestaurantFromId);

// POST /restaurant
router.post("/", requireAdmin, createRestaurant);

router.delete("/:id", requireAdmin, deleteRestaurant);

router.patch("/:id", requireAdmin, updateRestaurant);

module.exports = router;
