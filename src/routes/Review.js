const { Router } = require("express");
const { getAllReviews, getReview, postReview } = require("../controllers/reviewController");
const router = Router();


router.get("/", async (req, res) => {
    try {
        let reviews = await getAllReviews()
        res.status(200).send(reviews)
    } catch (error) {
        return { error: error.message };
    }
})


router.get("/:id", async (req, res) => {
    const { id } = req.params   
    try {
        console.log(id, req.params)
        let userReview = await getReview(id)
        res.status(200).send(userReview)
    } catch (error) {
        return { error: error.message };
    }
})


router.post("/create", async (req, res) => {
    const { content, rating, productId, username } = req.body
    try {
        console.log(productId)
        let newReview = await postReview(content, rating, productId, username)
        res.status(200).send(newReview);
        
    } catch (error) {
        return { error: error.message };
    }
})





module.exports = router;