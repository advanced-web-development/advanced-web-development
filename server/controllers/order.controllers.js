const { prisma } = require("../lib/prisma");
const { hasOrder, hasRestaurant } = require("../utils/dbIdCheck");

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
          price: true,
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
    const userId = parseInt(req.userId);
    const orders = await prisma.order.findMany({
      select: prismaOrderSelectValues,
      where: {
        userId,
      },
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
    let query = {};
    const restaurantId = parseInt(req.query.restaurantId);
    if (req.query.status) {
      query = {
        orderStatus: req.query.status,
      };
    }
    await hasRestaurant(restaurantId);
    const orders = await prisma.order.findMany({
      where: {
        ...query,
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

const updateOrderStatus = async (req, res) => {
  try {
    const { orderDetail } = req.body;

    await hasOrder(orderDetail.id);
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderDetail.id,
      },
      data: {
        orderStatus: orderDetail.status,
      },
    });

    res.send({ data: updatedOrder });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    await hasOrder(orderId);
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: prismaOrderSelectValues,
    });

    let totalCost = 0;
    order.orderItems.forEach(
      (item) => (totalCost += item.quantity * item.product.price)
    );

    res.send({ data: { order, totalCost } });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  getAllOrders,
  placeOrder,
  getAllLoggedInUserOrders,
  getAllRestaurantOrders,
  updateOrderStatus,
  getSingleOrder,
};