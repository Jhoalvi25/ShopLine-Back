const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
};

module.exports = generateToken;
