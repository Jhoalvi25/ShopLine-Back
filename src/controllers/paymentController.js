const stripe = require("stripe")(process.env.STRIPE_KEY)
const { Order, Payment, User } = require("../db")


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

        
        // const user = await User.findByPk(userId)

        // const pay = await user.addPayment(newPayment)
        // console.log(pay, "payyyy")
        return payment
    } catch (error) {
        return { error: error.message };
    }
}


const getReceipts = async (userId) => {
    try {
        const user = await User.findAll({
            where:{
                id: userId
            },
            include:{
                model: Payment,
                attributes: ["id", "amount", "currency", "status", "payment_method_types", "description"]
            }
        })
        
        return user
    } catch (error) {
        return { error: error.message };
    }
}


module.exports = {
    getPayment,
    getReceipts
}