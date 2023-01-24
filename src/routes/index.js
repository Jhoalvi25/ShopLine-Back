const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const Products = require("./Products");
const Categories = require("./Categories");
const Users = require("./Users");
const Cart = require("./Cart");
const Reviews = require("./Review")

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/products", Products);
router.use("/categories", Categories);
router.use("/users", Users);
router.use("/cart", Cart);
router.use("/reviews", Reviews);

module.exports = router;
