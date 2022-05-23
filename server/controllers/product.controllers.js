const { prisma } = require("../lib/prisma");

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.send({ data: products });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getProductFromId = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(productId),
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    res.send({ data: product });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const { productCategoryId, ...restData } = productData;

    const newProduct = await prisma.product.create({
      data: {
        ...restData,
        productCategory: {
          connect: {
            id: parseInt(productCategoryId),
          },
        },
      },
    });

    res.send({ data: newProduct });
  } catch (error) {
    if (error.code === "P2002") {
      res.status(400).send({ error: "product already exists" });
    } else {
      res.status(400).send({ error: error.message });
    }
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productIdToDelete = req.params.id;
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(productIdToDelete),
      },
    });
    if (!product) {
      throw new Error("Product to delete not found");
    }

    await prisma.orderItem.deleteMany({
      where: {
        productId: parseInt(productIdToDelete),
      },
    });

    const deletedProduct = await prisma.product.delete({
      where: {
        id: parseInt(productIdToDelete),
      },
    });

    res.send({ data: deletedProduct });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productIdToUpdate = req.params.id;
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(productIdToUpdate),
      },
    });
    if (!product) {
      throw new Error("product to update not found");
    }

    const { productCategoryId, ...restData } = req.body;

    let toUpdateData = {
      ...restData,
    };

    if (productCategoryId) {
      toUpdateData.productCategory = {
        connect: {
          id: parseInt(productCategoryId),
        },
      };
    }

    const updatedData = await prisma.product.update({
      where: { id: parseInt(productIdToUpdate) },
      data: toUpdateData,
      include: {
        productCategory: true,
      },
    });

    res.send({ data: updatedData });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductFromId,
  createProduct,
  deleteProduct,
  updateProduct,
};
