const { prisma } = require("../lib/prisma");

const getUserTransactionHistory = async (req, res) => {
  try {
    const userId = parseInt(req.userId);
    const transactions = await prisma.transactions.findMany({
      where: {
        userId,
      },
    });

    res.send({ data: transactions });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { getUserTransactionHistory };
