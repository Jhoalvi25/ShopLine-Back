const axios = require("axios");
const { Product } = require('../db')




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
        rating: e.rating
      }
    })
  });
    
    return apiProducts

  } catch (error) {
    return { error: error.message };
  }
}





module.exports = getAllProducts;