const { prisma } = require("../lib/prisma");

const getAllProductCategories = async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany();
    res.send({ data: restaurants });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getProductCategoryFromId = async (req, res) => {
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

const createProductCategory = async (req, res) => {
  try {
    const restaurantData = req.body;
    const { openingHour, closingHour, ...restData } = restaurantData;

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
    if (error.code === "P2002") {
      res.status(400).send({ error: "Restaurant already exists" });
    } else {
      res.status(400).send({ error: error.message });
    }
  }
};

const deleteProductCategory = async (req, res) => {
  try {
    const restaurantIdToDelete = req.params.id;
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: parseInt(restaurantIdToDelete),
      },
    });
    if (!restaurant) {
      throw new Error("Restaurant to delete not found");
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

const updateProductCategory = async (req, res) => {
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
  getAllProductCategories,
  getProductCategoryFromId,
  createProductCategory,
  deleteProductCategory,
  updateProductCategory,
};
