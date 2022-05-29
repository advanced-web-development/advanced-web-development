const jwt = require("jsonwebtoken");
const { config } = require("../constants/config");

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
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
        req.user = decodedToken;
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

module.exports = { requireAuth };
