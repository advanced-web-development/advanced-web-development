const { prisma } = require("../lib/prisma");

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany();
    res.send({ data: restaurants });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getRestaurantFromId = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: parseInt(restaurantId),
      },
    });

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    res.send({ data: restaurant });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const restaurantData = req.body;
    const userId = parseInt(req.userId);
    const { openingHour, closingHour, ...restData } = restaurantData;

    const newRestaurant = await prisma.restaurant.create({
      data: {
        ...restData,
        adminUsers: {
          connect: {
            id: userId,
          },
        },
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
    if (error.code === "P2002") {
      res.status(400).send({ error: "Restaurant already exists" });
    } else {
      res.status(400).send({ error: error.message });
    }
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const userId = parseInt(req.userId);
    const restaurantIdToDelete = req.params.id;
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: parseInt(restaurantIdToDelete),
      },
      select: {
        id: true,
        adminUsers: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!restaurant) {
      throw new Error("Restaurant to delete not found");
    }

    const allAdminIds = restaurant.adminUsers.map((user) => user.id);

    if (!allAdminIds.includes(userId)) {
      throw new Error("You are not authorized to delete this restaurant");
    }

    const deletedRestaurant = await prisma.restaurant.delete({
      where: {
        id: parseInt(restaurantIdToDelete),
      },
    });

    res.send({ data: deletedRestaurant });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const restaurantIdToUpdate = req.params.id;
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: parseInt(restaurantIdToUpdate),
      },
    });
    if (!restaurant) {
      throw new Error("Restaurant to update not found");
    }

    const { openingHour, closingHour, ...restData } = req.body;

    let toUpdateData = {
      ...restData,
    };

    if (openingHour || closingHour) {
      toUpdateData.operatingHour = {
        update: {
          ...(openingHour && { openingHour: { update: openingHour } }),
          ...(closingHour && { closingHour: { update: closingHour } }),
        },
      };
    }

    const updatedData = await prisma.restaurant.update({
      where: { id: parseInt(restaurantIdToUpdate) },
      data: toUpdateData,
      include: {
        operatingHour: {
          include: {
            closingHour: true,
            openingHour: true,
          },
        },
      },
    });

    res.send({ data: updatedData });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantFromId,
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
};
