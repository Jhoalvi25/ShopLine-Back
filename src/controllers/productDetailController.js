const { Product, Review } = require('../db')



const getProductsDetail = async(id) => {
    try {
        // const detailDb = await Product.findByPk(id)
        const detailDb = await Product.findOne({
            where:{
                id: id
            },
            include:{
                model:Review,
                attributes:["content", "rating", "username"],
                throught: {
                    attributes:[]
                }
            }
        })
        return detailDb      
    } catch (error) {
        return { error: error.message };
    }
}


module.exports = getProductsDetail