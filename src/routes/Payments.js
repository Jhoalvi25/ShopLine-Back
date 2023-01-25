const { Router } = require("express");
const PaymentController = require("../controllers/paymentController");
const PaymentServices = require("../services/paymentServices");

const PaymentInstance = new PaymentController(new PaymentServices());

const router = Router();


router.get("/", (req, res) => {
    PaymentInstance.getPaymentLink(req, res)
})

router.post("/", (req, res) => {
    PaymentInstance.getPaymentLink(req, res)
})


module.exports = router;