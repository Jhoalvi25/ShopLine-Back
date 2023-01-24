const { Router } = require("express");
const { Cart, User } = require("../db");

const router = Router();

router.post("/create", async (req, res) => {
  try {
    const { products, total } = req.body;

    const listProducts = await Cart.findOrCreate({
      products,
      total,
    });

    res.status(200).send(listProducts);
  } catch (error) {
    return { error: error.message };
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const userListProducts = await Cart.findByPk(id, {
      include: {
        model: User,
        attributes: ["name"],
      },
    });

    res.status(200).send(userListProducts);
  } catch (error) {
    return { error: error.message };
  }
});

module.exports = router;
