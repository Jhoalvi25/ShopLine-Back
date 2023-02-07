const { Review, Product } = require('../db')


const getReview = async (id) => {
    // const review = await Review.findByPk(id)
    // return review;

    const productAndHisReviews = await Product.findByPk(id, {
        include:{
            model:Review,
            attributes:["content", "rating", "username"],
            through:{
                attributes:[],
            }
        }
    })

    return productAndHisReviews;
}


const postReview = async (content, rating, productId, username) => {
    try {
        if(!content){
            throw new Error("Can't submit without a content");
        }
    
        const newReview = await Review.create({
            username:username,
            content: content,
            rating: rating,
        })
    
        const product = await Product.findByPk(productId)
    
        product.addReview(newReview)
    
    
        return newReview;
        
    } catch (error) {
        return { error: error.message };

    }
}

const getAllReviews = async () => {
    const allReviews = await Review.findAll()
    return allReviews
}




module.exports = {
    postReview,
    getReview,
    getAllReviews
}