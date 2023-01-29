const stripe = require("stripe")(process.env.STRIPE_KEY)
const { Order, Payment } = require("../db")


const getPayment = async (id, amount, description) => {
    try {
        const payment = await stripe.paymentIntents.create({
            amount:amount,
            currency: "USD",
            description: description,
            payment_method: id,
            confirm: true
        })
       
        const { currency, payment_method_types, status } = payment

        const newPayment = await Payment.create({
            id: id,
            amount: amount,
            currency: currency,
            payment_method_types: payment_method_types,
            status: status,
            description: description,
        })

        const newOrder = await Order.create({
            payments:newPayment
        })

        const findPayment = await Payment.findAll({
            where: {
                id: id
            }
        })

        newOrder.addPayment(findPayment)

        return payment
    } catch (error) {
        return { error: error.message };
    }
}


//1.-Crear modelo Order
//2.-Generar la order y asociarla a un usuario
//3.-Order 
// -User
// -Payment Id
// 4.-Generar modelo Payment (guardar datos que genera stripe)



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