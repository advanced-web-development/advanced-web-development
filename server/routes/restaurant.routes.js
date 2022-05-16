const express = require("express");
const { prisma } = require("../lib/prisma");

const router = express.Router();

// GET /restaurant
router.get("/", async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany();
    res.send({ data: restaurants });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/:id", (req, res) => {
  res.send("FROM ID");
});

// POST /restaurant
router.post("/", async (req, res) => {
  try {
    console.log("REQ BODY", req.body);
    const restaurantData = req.body;
    const { openingHour, closingHour, ...restData } = restaurantData;
    console.log("restData", restData);
    const newRestaurant = await prisma.restaurant.create({
      data: {
        ...restData,
        operatingHour: {
          create: {
            closingHour: {
              create: closingHour,
            },
            openingHour: {
              create: openingHour,
            },
          },
        },
      },
    });

    res.send({ data: newRestaurant });
  } catch (error) {
    console.log("ERROR", error);
    res.status(400).send({ error });
  }
});

module.exports = router;
