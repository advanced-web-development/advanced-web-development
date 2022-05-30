const { prisma } = require("../lib/prisma");

const hasOrder = async (id) => {
  const order = await prisma.order.findUnique({
    where: {
      id,
    },
  });
  if (!order) {
    throw new Error("Order not found");
  }
};

const hasProduct = async (id) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  if (!product) {
    throw new Error("Product not found");
  }
};

const hasRestaurant = async (id) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id,
    },
  });
  if (!restaurant) {
    throw new Error("restaurant not found");
  }
};

module.exports = { hasOrder, hasProduct, hasRestaurant };
