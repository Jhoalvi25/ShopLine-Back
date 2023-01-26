const { Review } = require('../db')


const getReview = async (id) => {
    const review = await Review.findByPk(id)
    return review;
}


const postReview = async (content, rating) => {
    if(!content){
        throw new Error("Can't submit without a content");
    }

    const newReview = await Review.create({
        content: content,
        rating: rating,
    })

    return newReview;
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