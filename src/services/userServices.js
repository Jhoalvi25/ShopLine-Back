const { User } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken.js");
const sendEmail = require("../utils/sendEmail.js");
const comparePassword = require("../utils/comparePassword.js");
const { Op } = require("sequelize");
const dotenv = require("dotenv").config();

exports.getUserInfoWithGoogle = async (email) => {
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      throw new Error("User has not been registered yet. Please Sign up");
    } else {
      if (user.permissions === "Banned")
        throw new Error("User has been banned");
      if (user.email_verified && user.registered) return user;
      throw new Error(
        "Unregistered account. Complete the account veryfication"
      );
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
exports.getUserInfo = async (token, email) => {
  try {
    if (!token) {
      throw new Error("Invalid user");
    } else {
      return jwt.verify(
        token,
        process.env.TOKEN_SECRET,
        { algorithms: "HS256" },
        async function (err, verified) {
          if (err) throw new Error(err.message);
          else {
            const email = verified.email;
            const user = await User.findOne({
              where: { email: email, email_verified: true, registered: true },
            });

            if (user) {
              return user;
            } else throw new Error("Unauthorized");
          }
        }
      );
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.loginUser = async (email, password) => {
  console.log("email", email);
  try {
    const user = await User.findOne({
      where: { email: email, email_verified: true, registered: true },
    });
    if (!user) throw new Error("User has not been registered. Please Sign up");
    else {
      if (user.permissions === "Banned")
        throw new Error("User has been banned");
      let hashedPassword = user.password;
      console.log("hashed", hashedPassword, password);
      let passwordIsValid = await comparePassword(password, hashedPassword);
      if (passwordIsValid) {
        if (user.email_verified && user.registered) {
          let token = generateToken({ email: user.email });
          return { token: token };
        } else {
          throw new Error(
            "Unregistered account. Complete the account veryfication"
          );
        }
      } else {
        throw new Error("Invalid password");
      }
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.verifyUser = async (token, email) => {
  console.log("email", email);
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return "Something happened. Incorret User verification";
    } else {
      jwt.verify(
        token,
        process.env.TOKEN_SECRET,
        { algorithms: "HS256" },
        async function (err, verified) {
          if (err) throw new Error(err.message);
          else {
            user.email_verified = true;
            user.registered = true;
            console.log(verified);
            await user.save();
            console.log(verified);
            return user;
          }
        }
      );
    }
  } catch (err) {
    console.log("aa", err);
    throw new Error(err.message);
  }
};

exports.createUser = async (user) => {
  //Finding user in db

  const email = user.email;
  const password = user.password.toString();
  const userInDatabase = await User.findAll({
    where: { email: email, email_verified: true, registered: true },
  });
  const userExists = await userInDatabase.length;
  //Hashinh password to secure
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  delete user.changePassword;
  // Asigning/Verifying role, permissions and plan /hardcoded
  user.password = hashedPassword;
  user.status = user.email === "jhoalvipereiraaa@gmail.com" ? "Admin" : "User";
  user.permissions =
    user.email === "jhoalvipereiraaa@gmail.com" ? "All" : "Client";

  try {
    if (userExists) {
      throw new Error(`User is already registered with email ${email}`);
    } else {
      const userCreated = await User.create(user);
      let token = generateToken({ email: user.email });
      console.log(token);
      console.log(user);
      const message = `${"http://localhost:3001"}/user/verify/${email}/${token}`;
      await sendEmail(email, "ShopLine: Verify your account", message);
      return userCreated;
    }
  } catch (err) {
    throw new Error(err);
  }
};

exports.deleteUser = async (email) => {
  let user = await User.findOne({ where: { email: email } });

  try {
    if (!user) {
      throw new Error("User could not be founded");
    } else {
      await User.destroy({ where: { email: email } });
      return "User deleted successfully!";
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.searchuser = async (name) => {
  if (!name) {
    return [];
  } else {
    let user = await User.findAll({
      where: { nickname: { [Op.like]: `%${name}%` } },
    });

    try {
      if (!user) {
        throw new Error("User could not be founded");
      } else {
        return user;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
};
