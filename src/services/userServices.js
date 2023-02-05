const { User, Cart } = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const comparePassword = require("../utils/comparePassword");
const { Op } = require("sequelize");
const dotenv = require("dotenv").config();
const CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_URL;
const SERVER_URL = process.env.SERVER_URL;

exports.getUserInfoWithGoogle = async (user) => {
  let email = user.email;
  try {
    const userFounded = await User.findOne({
      where: { email: email, email_verified: true, registered: true },
    });
    if (!userFounded) {
      // throw new Error("User has not been registered yet. Please Sign up");
      let userGoogle = {};
      userGoogle.email_verified = true;
      userGoogle.registered = true;
      userGoogle.email = user.email;
      userGoogle.name = user.name;
      userGoogle.image = user.picture;

      let userCreated = await User.create(userGoogle);
      return userCreated;
    } else {
      if (userFounded.permissions === "Banned")
        throw new Error("User has been banned");

      if (userFounded.email_verified && userFounded.registered)
        return userFounded;
      else {
        throw new Error(
          "Unregistered account. Complete the account veryfication"
        );
      }
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
  try {
    const user = await User.findOne({
      where: { email: email, email_verified: true, registered: true },
    });
    if (!user) throw new Error("User has not been registered. Please Sign up");
    else {
      if (user.permissions === "Banned")
        throw new Error("User has been banned");
      let hashedPassword = user.password;
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
            await user.save();
            return user;
          }
        }
      );
    }
  } catch (err) {
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
  const userExpired = await User.findOne({
    where: { email: email, email_verified: false, registered: false },
  });

  const userExists = await userInDatabase.length;
  //Hashinh password to secure
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  delete user.changePassword;
  // Asigning/Verifying role, permissions and plan /hardcoded
  user.password = hashedPassword;
  user.rol =
    user.email === "jhoalvipereira@gmail.com"
      ? "Admin"
      : user.email === "jhoalvipereira@gmail.com"
      ? "Admin"
      : "User";
  user.permissions =
    user.email === "jhoalvipereira@gmail.com"
      ? "All"
      : user.email === "jhoalvipereira@gmail.com"
      ? "All"
      : "Client";

  try {
    if (userExists) {
      throw new Error(`User is already registered with email ${email}`);
    } else if (userExpired) {
      await userExpired.destroy();
    } else {
      const userCreated = await User.create(user);
      let token = generateToken({ email: user.email });
      const message = `${
        SERVER_URL || "http://localhost:3001"
      }/user/verify/${email}/${token}`;
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
      where: {
        name: { [Op.like]: `%${name}%` },
        email_verified: true,
        registered: true,
      },
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

exports.modifyUser = async (userId, settings) => {
  let user = await User.findOne({ where: { id: userId } });
  try {
    if (!user) {
      throw new Error("User could not be founded");
    } else {
      let password = settings?.password;
      let confirmPassword = settings?.confirmPassword;

      if (password.length && confirmPassword.length) {
        if (password === confirmPassword) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          Object.entries(settings).forEach(([key, value]) => {
            if (key === "password") {
              user[key] = hashedPassword;
            } else {
              user[key] = value;
            }
          });

          await user.save();

          return user;
        } else {
          throw new Error('"Password" and "Confirm password" are not the same');
        }
      } else {
        delete settings.password;
        delete settings.confirmPassword;

        Object.entries(settings).forEach(([key, value]) => {
          if (value?.length) user[key] = value;
          else return;
        });

        await user.save();

        return user;
      }
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
