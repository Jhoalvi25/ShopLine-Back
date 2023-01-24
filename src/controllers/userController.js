const { User } = require("../db");
const userServices = require("../services/userServices");


exports.getUser = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  let email = req.body.email;
  try {
    const user = await userServices.getUserInfo(token, email);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(404).send(err.message);
  }
};

exports.getUserWithGoogle = async (req, res) => {
  let userEmail = req.user["https://example.com/email"];
  try {
    const user = await userServices.getUserInfoWithGoogle(userEmail);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(404).send(err.message);
  }
};
exports.loginUser = async (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  try {
    const user = await userServices.loginUser(userEmail, userPassword);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(404).send(err.message);
  }
};

exports.verifyUser = async (req, res) => {
  const { token, email } = req.params;
  try {
    const userVeryfied = await userServices.verifyUser(token, email);

    res
      .status(200)
      .send({
        message: "User has been verified successfully. Account ready to use",
        data: userVeryfied,
      });
  } catch (err) {
    res.status(404).send(err.message);
  }
};

exports.createUser = async (req, res) => {
  const user = req.body;

  try {
    const userCreated = await userServices.createUser(user);
    res
      .status(201)
      .send({
        msg: "You are almost ready, please verify you email",
        data: userCreated,
      });
  } catch (err) {
    console.log("ERROR CONTROLLER: ", err);
    res.status(409).send(err.message);
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const userDeleted = await userServices.deleteUser(userId);
    res.status(200).send({ message: userDeleted });
  } catch (err) {
    res.status(404).send(err.message);
  }
};

exports.searchUsers = async (req, res) => {
  const name = req.query.name;
  try {
    const userSearch = await userServices.searchuser(name);
    res.status(200).send(userSearch);
  } catch (err) {
    res.status(404).send(err.message);
  }
};