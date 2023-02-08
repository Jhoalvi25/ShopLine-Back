const axios = require("axios");
const { Product } = require('../db')
const { Op } = require("sequelize")




const getAllProducts = async () => {
  try {
    const apiRequest = await axios.get("https://fakestoreapi.com/products")
    const apiProducts = apiRequest.data.map((elem) => {
      return {
        id: elem.id,
        title: elem.title,
        price: elem.price,
        category: elem.category,
        description: elem.description,
        image: elem.image,
        rating: elem.rating.rate,
      };
    });
    apiProducts.forEach(e =>  {
      Product.findOrCreate({
      where: {
        id: e.id,
        title: e.title,
        price: e.price,
        category: e.category,
        description: e.description,
        image: e.image,
        rating: e.rating,
      }
    })
  });
  
   const products = await Product.findAll()
   return products
    

  } catch (error) {
    return { error: error.message };
  }
}

const getPopularProducts = async () => {
  try {
    // const apiRequest = await axios.get("https://fakestoreapi.com/products")
    // const apiProducts = apiRequest.data.map((elem) => {
    //   return {
    //     id: elem.id,
    //     title: elem.title,
    //     price: elem.price,
    //     category: elem.category,
    //     description: elem.description,
    //     image: elem.image,
    //     rating: elem.rating.rate,
    //   };
    // });

    // console.log(apiProducts)
    // const popular = apiProducts.filter(e => e.rating > 3)
    // console.log(popular)
    // return popular
    const popular = await Product.findAll({
      where: {
        rating: {
          [Op.gt]: parseInt(3)
        }
      }
    })
    console.log(popular, "hereee")
    return popular

  }  catch (error) {
    return { error: error.message };
  }
}




module.exports = { 
  getAllProducts, 
  getPopularProducts
 };