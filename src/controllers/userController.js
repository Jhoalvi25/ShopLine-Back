const { User } = require("../db");

const getAllUsers = async () => {
  const users = await User.findAll();
  return users;
};

const getUser = async (id) => {
  const user = await User.findByPk(id);
  return user;
};

const postUser = async (
  name,
  mail,
  password,
  dni,
  phone,
  address,
  nationality,
  image
) => {
    
  const newUser = await User.create({
    name,
    mail,
    password,
    dni,
    phone,
    address,
    nationality,
    image,
  });

  return newUser;
};

module.exports = {
  getAllUsers,
  getUser,
  postUser,
};
