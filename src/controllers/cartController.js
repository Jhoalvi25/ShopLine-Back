const { Cart, Product } = require("../db");

const createCart = async (listProducts) => {
  try {
    const newCart = await Cart.create({
      listProducts: listProducts,
    });

    const list = await Product.findAll({
      where: {
        title: listProducts,
      },
    });

    newCart.addProduct(list);

    return newCart;
  } catch (error) {
    return { error: error.message };
  }
};

const getCart = async (id) => {
  try {
    const cartDetail = await Cart.findByPk(id, {
      include: {
        model: Product,
        attributes: ["title"],
      },
    });

    return cartDetail;
  } catch (error) {
    return { error: error.message };
  }
};

const getCarts = async () => {
  const carts = await Cart.findAll({
    include: [
      {
        model: Product,
        attributes: ["title"],
        through: {
          attributes: [],
        },
      },
    ],
  });
  return carts;
};

module.exports = {
  createCart,
  getCart,
  getCarts,
};
