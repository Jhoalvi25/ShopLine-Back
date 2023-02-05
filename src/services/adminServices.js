const { User } = require("../db.js");

exports.setUserAction = async (actionBan) => {
  try {
    const emailAdmin = actionBan.admin;
    const emailUser = actionBan.user;
    const action = actionBan.action;
    if (emailAdmin === emailUser)
      throw new Error("The user to ban cannot be the same as the admin");

    const checkAdmin = await User.findOne({
      where: { email: emailAdmin, rol: "Admin", permissions: "All" },
    });
    const checkUser = await User.findOne({ where: { email: emailUser } });

    if (checkAdmin && checkUser) {
      //Roles
      if (action === "Admin") checkUser.rol = "Admin";
      if (action === "User") checkUser.rol = "User";
      //Permissions
      if (action === "Banned") checkUser.permissions = "Banned";
      if (action === "Edit") checkUser.permissions = "Edit";
      if (action === "Client") checkUser.permissions = "Client";
      if (action === "All") checkUser.permissions = "All";
      checkUser.save();
      return checkUser;
    } else {
      throw new Error("Cannot find some admin or user");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
