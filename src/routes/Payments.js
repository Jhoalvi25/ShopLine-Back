const { Router } = require("express");
const getPayment = require("../controllers/paymentController");
// const PaymentController = require("../controllers/paymentController");
// const PaymentServices = require("../services/paymentServices");

// const PaymentInstance = new PaymentController(new PaymentServices());

const router = Router();

router.post("/", async (req, res) => {
    const { id, amount, description } = req.body;
    try {
        const stripePayment = await getPayment(id, amount, description)
        return res.status(200).send(stripePayment);
    } catch (error) {
        return { error: error.message };
    }
})


// router.get("/", (req, res) => {
//     PaymentInstance.getPaymentLink(req, res)
// })

// router.post("/", (req, res) => {
//     PaymentInstance.getPaymentLink(req, res)
// })


module.exports = router;