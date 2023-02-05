const adminServices = require("../services/adminServices");

exports.adminAction = async (req, res) => {
  const actionBan = req.body; // emailAdmin - emailUser - action

  try {
    const bannedUser = await adminServices.setUserAction(actionBan);
    res.status(200).send(bannedUser);
  } catch (err) {
    res.status(404).send(err.message);
  }
};
