const jwt = require("jsonwebtoken");
const { config } = require("../constants/config");

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      status: "error",
      error: "No token provided",
    });
  }
  const splittedToken = token.split(" ");
  if (token) {
    jwt.verify(
      splittedToken[1],
      config.accessTokenSecret,
      (err, decodedToken) => {
        if (err) {
          return res.status(401).json({
            status: "error",
            error: "Invalid token",
          });
        }
        req.userId = decodedToken.id;
        req.userType = decodedToken.type;
        next();
      }
    );
  } else {
    return res.status(401).json({
      status: "error",
      error: "No token provided",
    });
  }
};

const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      status: "error",
      error: "No token provided",
    });
  }
  const splittedToken = token.split(" ");
  if (token) {
    jwt.verify(
      splittedToken[1],
      config.accessTokenSecret,
      (err, decodedToken) => {
        if (err) {
          return res.status(401).json({
            status: "error",
            error: "Invalid token",
          });
        }
        req.userId = decodedToken.id;
        req.userType = decodedToken.type;
        if (decodedToken.type !== "ADMIN") {
          return res.status(401).json({
            status: "error",
            error: "Not authorized",
          });
        } else {
          next();
        }
      }
    );
  } else {
    return res.status(401).json({
      status: "error",
      error: "No token provided",
    });
  }
};

module.exports = { requireAuth, requireAdmin };
