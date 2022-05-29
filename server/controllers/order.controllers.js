const { prisma } = require("../lib/prisma");

const prismaOrderSelectValues = {
  id: true,
  orderStatus: true,
  orderTime: true,
  forRestaurant: {
    select: {
      id: true,
      name: true,
    },
  },
  orderItems: {
    select: {
      id: true,
      product: {
        select: {
          id: true,
          name: true,
        },
      },
      quantity: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      select: prismaOrderSelectValues,
    });
    res.send({ data: orders });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getAllLoggedInUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await prisma.order.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      select: prismaOrderSelectValues,
    });
    res.send({ data: orders });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getAllRestaurantOrders = async (req, res) => {
  try {
    const restaurantId = req.query.restaurantId;
    const orders = await prisma.order.findMany({
      where: {
        forRestaurant: {
          id: parseInt(restaurantId),
        },
      },
      select: prismaOrderSelectValues,
    });
    res.send({ data: orders });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const placeOrder = async (req, res) => {
  try {
    const { data } = req.body;
    const userId = parseInt(req.userId);
    const { orderItems, restaurantId, ...restData } = data;

    const order = await prisma.order.create({
      data: {
        ...restData,
        forRestaurant: {
          connect: { id: restaurantId },
        },
        orderItems: {
          createMany: {
            data: orderItems,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    res.send({ data: order });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  getAllOrders,
  placeOrder,
  getAllLoggedInUserOrders,
  getAllRestaurantOrders,
};
