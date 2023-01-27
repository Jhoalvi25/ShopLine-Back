const { Router } = require("express");
const { getCart, createCart, getCarts, addToCart } = require("../controllers/cartController")
const { Cart, User } = require("../db");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const carts = await getCarts()
    res.status(200).send(carts)
  } catch (error) {
    return { error: error.message };
  }
})


router.post("/create", async (req, res) => {
  const { products } = req.body;
  try {
    const newCart = await createCart(products)
    res.status(200).send(newCart);
  } catch (error) {
    return { error: error.message };
  }
});

router.post("/add/:id", async (req, res) => {
  const { id } = req.params
  const { products } = req.body
  try {
    const clientCart = await addToCart(id, products)
    return res.status(200).send(clientCart);
  } catch (error) {
    return { error: error.message };
  }
})

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const cartDetail = await getCart(id)

    res.status(200).send(cartDetail);
  } catch (error) {
    return { error: error.message };
  }
});


module.exports = router;
