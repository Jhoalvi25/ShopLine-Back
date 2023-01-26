const bcrypt = require("bcrypt");

async function comparePassword(plaintextPassword, hash) {
  plaintextPassword = plaintextPassword.toString();
  try {
    let isValid = await bcrypt.compare(plaintextPassword, hash);
    return isValid;
  } catch (err) {
    throw new Error("Invalid password");
  }
}

module.exports = comparePassword;
