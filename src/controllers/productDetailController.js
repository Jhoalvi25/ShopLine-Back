const { Product } = require('../db')



const getProductsDetail = async(id) => {
    try {
        const detailDb = await Product.findByPk(id)
        return detailDb      
    } catch (error) {
        return { error: error.message };
    }
}


module.exports = getProductsDetail