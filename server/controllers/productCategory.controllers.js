const { prisma } = require("../lib/prisma");

const getAllProductCategories = async (req, res) => {
  try {
    const products = await prisma.productCategory.findMany();
    res.send({ data: products });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getProductCategoryFromId = async (req, res) => {
  try {
    const productCategoryId = req.params.id;
    const productCategory = await prisma.productCategory.findUnique({
      where: {
        id: parseInt(productCategoryId),
      },
      select: {
        id: true,
        name: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
          },
        },
      },
    });

    if (!productCategory) {
      throw new Error("Product category not found");
    }

    res.send({ data: productCategory });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const createProductCategory = async (req, res) => {
  try {
    const productCategoryData = req.body;
    const { name } = productCategoryData;

    const newProductCategory = await prisma.productCategory.create({
      data: {
        name,
      },
    });

    res.send({ data: newProductCategory });
  } catch (error) {
    if (error.code === "P2002") {
      res.status(400).send({ error: "Product category already exists" });
    } else {
      res.status(400).send({ error: error.message });
    }
  }
};

const deleteProductCategory = async (req, res) => {
  try {
    const productCategoryIdToDelete = req.params.id;

    const productCategory = await prisma.productCategory.findUnique({
      where: {
        id: parseInt(productCategoryIdToDelete),
      },
    });

    if (!productCategory) {
      throw new Error("Product category not found");
    }

    // Delete all order items with product of given productId
    await prisma.orderItem.deleteMany({
      where: {
        product: {
          productCategoryId: parseInt(productCategoryIdToDelete),
        },
      },
    });

    // Delete all products with given product id
    await prisma.product.deleteMany({
      where: { productCategoryId: parseInt(productCategoryIdToDelete) },
    });

    // Delete product category
    const deletedProductCategory = await prisma.productCategory.delete({
      where: { id: parseInt(productCategoryIdToDelete) },
    });

    res.send({ data: deletedProductCategory });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const updateProductCategory = async (req, res) => {
  try {
    const productCategoryIdToUpdate = req.params.id;
    const productCategory = await prisma.productCategory.findUnique({
      where: {
        id: parseInt(productCategoryIdToUpdate),
      },
    });
    if (!productCategory) {
      throw new Error("Product category to update not found");
    }

    const { name } = req.body;

    const updatedData = await prisma.productCategory.update({
      where: { id: parseInt(productCategoryIdToUpdate) },
      data: { name },
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
