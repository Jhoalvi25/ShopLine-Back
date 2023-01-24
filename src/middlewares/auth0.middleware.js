const { auth } = require("express-oauth2-jwt-bearer");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
var jwksClient = require("jwks-rsa");
dotenv.config();

const validateAccessToken = auth({
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  audience: process.env.AUTH0_AUDIENCE,
});

var client = jwksClient({
  jwksUri: "https://dev-ril5g3yq77wjfx3s.us.auth0.com/.well-known/jwks.json",
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send({ error: "Acceso denegado" });
  try {
    jwt.verify(
      token,
      getKey,
      { algorithms: "RS256" },
      function (err, verified) {
        console.log("t", verified); // bar
        if (err) throw new Error(err.message);
        req.user = verified;
        next();
      }
    );
  } catch (error) {
    res.status(400).send({ error: error.message });
    console.log(error);
  }
};

module.exports = {
  validateAccessToken,
  verifyToken,
  getKey,
};
