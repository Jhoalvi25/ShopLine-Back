const { Cart, Product, User } = require("../db");

const createCart = async (products) => {
  try {
    const newCart = await Cart.create({
      products,
    });

    const list = await Product.findAll({
      where: {
        title: products,
      },
    });

    newCart.addProduct(list);

    return newCart;
  } catch (error) {
    return { error: error.message };
  }
};

const addToCart = async (id, productId) => {
  try {
    
    let [cart, created] = await Cart.findOrCreate({
      where: {
        userId: id,
      }
    });
    
    let user = await User.findByPk(id)
    if(!created){
      user.setCart(cart)
    }

    let adding = await Product.findAll({
      where: {
        id: productId,
      },
    });

    cart.addProduct(adding);

    return cart;
  } catch (error) {
    return { error: error.message };
  }
};

const getCart = async (id) => {
  try {
    const cartDetail = await Cart.findAll({
      where: {
        userId: id,
      },
      include: {
        model: Product,
        attributes: ["title", "price", "image"],
        through: {
          attributes: [],
        },
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
        attributes: ["title", "price", "image"],
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
  addToCart,
  getCart,
  getCarts,
};
