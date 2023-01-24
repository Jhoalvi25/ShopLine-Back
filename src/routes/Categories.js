const categories = require("../utils/categories")
const { Router } = require("express");

const router = Router();


router.get("/", (req, res) => {
    try {
        return res.status(200).send(categories)
    } catch (error) {
        return { error: error.message };
    }
})

module.exports = router;
