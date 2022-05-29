const express = require("express");
const {
  getAllRestaurants,
  getRestaurantFromId,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurant.controllers");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /restaurant
router.get("/", requireAuth, getAllRestaurants);

router.get("/:id", requireAuth, getRestaurantFromId);

// POST /restaurant
router.post("/", requireAuth, createRestaurant);

router.delete("/:id", requireAuth, deleteRestaurant);

router.patch("/:id", requireAuth, updateRestaurant);

module.exports = router;
