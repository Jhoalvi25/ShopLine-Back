const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const Products = require("./Products");
const Categories = require("./Categories");
const Users = require("./Users");
const Admin = require("./Admin");
const Cart = require("./Cart");
const Reviews = require("./Review");
const Payment = require("./Payments");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/products", Products);
router.use("/categories", Categories);
router.use("/user", Users);
router.use("/admin", Admin);
router.use("/cart", Cart);
router.use("/reviews", Reviews);
router.use("/payments", Payment);

module.exports = router;
