const { Router } = require("express");
const {getPayment, getReceipts } = require("../controllers/paymentController");


const router = Router();

router.post("/", async (req, res) => {
    const { id, amount, description, userId } = req.body;
    try {
        const stripePayment = await getPayment(id, amount, description, userId )
        return res.status(200).send(stripePayment);
    } catch (error) {
        return { error: error.message };
    }
})

router.get("/receipt/:userId", async (req, res) => {
    try {
        const { userId } = req.params
        const receipts = await getReceipts(userId)
        return res.status(200).send(receipts)       
    } catch (error) {
        return { error: error.message };
        
    }
})




module.exports = router;










// const PaymentController = require("../controllers/paymentController");
// const PaymentServices = require("../services/paymentServices");

// const PaymentInstance = new PaymentController(new PaymentServices());


// router.get("/", (req, res) => {
//     PaymentInstance.getPaymentLink(req, res)
// })

// router.post("/", (req, res) => {
//     PaymentInstance.getPaymentLink(req, res)
// })