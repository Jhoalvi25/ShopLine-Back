const bcrypt = require("bcrypt");

async function hashPassword(plaintextPassword) {
  plaintextPassword = plaintextPassword.toString();
  bcrypt
    .hash(plaintextPassword, 10)
    .then((hash) => {
      // Store hash in the database
      return hash;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
}

module.exports = hashPassword;
