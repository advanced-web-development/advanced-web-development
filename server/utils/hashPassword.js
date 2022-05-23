const bcrypt = require("bcryptjs");
const { config } = require("../constants/config");

const hashPassword = (password) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(config.saltRounds, (err, salt) => {
      if (err) {
        reject(err.message);
      } else {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(hash);
          }
        });
      }
    });
  });

const comparePassword = (stringPassword, hashPassword) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(stringPassword, hashPassword, (err, res) => {
      if (err) {
        reject(res);
      } else {
        resolve(res);
      }
    });
  });

module.exports = { comparePassword, hashPassword };
