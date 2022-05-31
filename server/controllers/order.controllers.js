const { prisma } = require("../lib/prisma");
const { hasOrder, hasRestaurant } = require("../utils/dbIdCheck");

const prismaOrderSelectValues = {
  id: true,
  orderStatus: true,
  orderTime: true,
  estimatedDeliveryTime: true,
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
    // id status estimatedTime(in Integer representing minutes)

    await hasOrder(orderDetail.id);
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderDetail.id,
      },
      data: {
        orderStatus: orderDetail.status,
        estimatedDeliveryTime: parseInt(orderDetail.estimatedTime) || 0,
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

const finalCheckout = async (req, res) => {
  try {
    const body = req.body;
    const orderId = parseInt(body.orderId);
    await hasOrder(orderId);
    const orderDetail = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
        userId: true,
        orderItems: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
    let transactionTotal = 0;
    orderDetail.orderItems.forEach((item) => {
      transactionTotal += item.product.price * item.quantity;
    });

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        orderStatus: "DELIVERED",
      },
    });

    await prisma.transactions.create({
      data: {
        amount: transactionTotal,
        order: {
          connect: {
            id: orderId,
          },
        },
        user: {
          connect: {
            id: orderDetail.userId,
          },
        },
      },
    });

    res.send({ data: updatedOrder });
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
  finalCheckout,
};
