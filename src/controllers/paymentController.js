const Stripe = require("stripe")


const getPayment = async (id, amount, description) => {
    const stripe = new Stripe(process.env.STRIPE_KEY)
    const payment = stripe.paymentIntents.create({
        amount:amount,
        currency: "USD",
        description: description,
        payment_method: id,
        confirm: true
    })
   
    return payment
}






// class PaymentController {
//     constructor(subscriptionService){
//         this.subscriptionService = subscriptionService;
//     }

//     async getPaymentLink(req, res){
//         try {
//             const payment = await this.subscriptionService.createPayment();
//             return res.json(payment);
//         } catch (error) {
//             console.log(error)

//             return res
//                 .status(500)
//                 .json({ error: true, msg: "Failed to create payment"});
//         }
//     }
// }

module.exports = getPayment;