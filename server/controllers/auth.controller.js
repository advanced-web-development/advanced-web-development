const { prisma } = require("../lib/prisma");

const { comparePassword, hashPassword } = require("../utils/hashPassword");
const { signUser } = require("../utils/jwt");

const createUser = async (req, res) => {
  try {
    const { userDetail } = req.body;

    const { password, ...restData } = userDetail;

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { ...restData, password: hashedPassword },
    });

    if (!user) {
      throw new Error("Error creating user");
    }

    const token = signUser(user);

    res.status(200).send({ status: "success", data: token });
  } catch (error) {
    if (error.code === "P2002") {
      res.status(400).send({
        status: "error",
        error: `User with given email already exists`,
      });
    } else {
      res.status(400).send({ status: "error", error: error.message });
    }
  }
};

const signIn = async (req, res) => {
  try {
    const { userDetail } = req.body;
    const user = await prisma.user.findUnique({
      where: { email: userDetail.email },
    });

    if (!user) {
      return res
        .status(404)
        .send({ status: "error", error: "No user for given email found" });
    }

    const isPasswordValid = await comparePassword(
      userDetail.password,
      user.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .send({ status: "error", error: "Incorrect password" });
    }

    const token = signUser(user);

    res.status(200).send({ status: "success", data: token });
  } catch (error) {
    res.status(400).send({ status: "error", error: error.message });
  }
};

module.exports = { createUser, signIn };
