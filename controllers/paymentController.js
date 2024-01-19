import stripe from 'stripe'



export const processPayment = async(req,res,next) => {
    try{
        console.log(req.body)
        const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY);
        const payment = await stripeClient.paymentIntents.create({
            amount: req.body.amount * 100,
            currency: 'inr'
        })

        res.status(201).send({
            clientSecret: payment.client_secret
        })

    }catch(err){
        next(err)
    }
}

export const sendStripeApiKey = async (req,res,next) => {
    try{
        res.status(200).send()

    }catch(err){
        next(err)
    }
}