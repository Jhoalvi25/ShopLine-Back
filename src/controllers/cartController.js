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

    if(adding[0].dataValues.stock === 0){
      return null
    } else {
      // await Product.upsert({
      //   id:productId,
      //   stock: stock--
      // })
      // OR
      // adding[0].dataValues.stock-- then save()
      // OR
      // with the method update()
      // OR
      // adding.set({
      //   stock: stock--
      // })
      // adding = await adding.save()

    }

    //console.log(adding[0].dataValues.stock)
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
        attributes: ["id","title", "price", "image", "stock"],
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


const deleteFromCart = async (id, productId) => {
  try {
    const [cart] = await Cart.findAll({
      where:{
        userId: id
      },
    })

    const deleted = await Product.findAll({
      where:{
        id: productId
      }
    })
    

    cart.removeProduct(deleted)
    return cart
  } catch (error) {
    return { error: error.message }; 
  }
}

const deleteCartAfterPayment = async (userId) => {
    const [cart] = await Cart.findAll({
      where:{
        userId: userId
      }
    })

    cart.destroy()

    return "The cart has been paid and destroyed";
}


module.exports = {
  createCart,
  addToCart,
  getCart,
  getCarts,
  deleteFromCart,
  deleteCartAfterPayment
};
