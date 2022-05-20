const express = require("express");
const {
  getAllRestaurants,
  getRestaurantFromId,
  createRestaurant,
  updateRestaurant,
} = require("../controllers/restaurant.controllers");

const router = express.Router();

// GET /restaurant
router.get("/", getAllRestaurants);

router.get("/:id", getRestaurantFromId);

// POST /restaurant
router.post("/", createRestaurant);

router.delete("/:id");

router.patch("/:id", updateRestaurant);

module.exports = router;
