const jwt = require("jsonwebtoken");
const { config } = require("../constants/config");

const signUser = (user) => {
  return jwt.sign({ id: user.id, type: user.type }, config.accessTokenSecret, {
    expiresIn: 60 * 60 * 24,
  });
};

const getTokenDataFromHeader = (req) => {
  try {
    const token =
      req.headers.authorization &&
      req.headers.authorization.split("Bearer ")[1];

    if (!token) {
      throw new Error("Unauthorized (No token)");
    }

    const isVerified = jwt.verify(token, config.accessTokenSecret);

    return isVerified;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { signUser, getTokenDataFromHeader };
