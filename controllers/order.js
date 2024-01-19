import Cart from "../models/Cart.js"
import CartItem from "../models/CartItem.js"
import Order from "../models/Order.js"
import Product from "../models/Product.js"

export const createOrder = async (req,res,next) => {
    try{
        const {items, mode, } = req.body
       

        const order = new Order({
            userId: req.userId,
            totalPrice : req.body.totalPrice,
            items: items,
            paymentMode: mode,
            address: req.body.address,
            email: req.body.email,
            name: req.body.name,
            phone: req.body.phone
        })

        for(const item of items){
            try{
                const product = await Product.findById(item.productId)
                product.stock = product.stock - item.quantity 

                await product.save()
            }catch(err){
                console.log(err)
            }
        }
        
        await order.save()

        const cart = await Cart.findById(req.body.cartId)
        cart.totalPrice = 0
        

        const cartItems = await CartItem.deleteMany({cartId: req.body.cartId})
        await cart.save()

        res.status(201).send(order)

    }catch(err){
        next(err) 
    }
}

export const getUserOrders = async (req,res,next) => {
    try{
        const userOrders = await Order.find({userId: req.userId})

        res.status(200).send(userOrders)
    }catch(err){
        next(err)
    }
}

export const getAllOrders = async (req,res,next) => {
    try{
        
        
        let paymentMode = req.query.paymentMode || "All"
        let status = req.query.status || "All"

        
        const paymentModeOptions = [
          "online",
          "cash"
        ]

        const statusOptions = [
            "pending",
            "shipped",
            "delivered"
        ]

        paymentMode === "All" ? (paymentMode = [...paymentModeOptions]) : (paymentMode = req.query.paymentMode.split(","))
        status === "All" ? (status = [...statusOptions]) : (status = req.query.status.split(","))
        
        
        const orders = await Order.find({
          paymentMode: {$in: [...paymentMode]},
          status: {$in: [...status]}
        })

        res.status(200).send(orders)
    }catch(err){
        next(err)
    }
}

export const orderUpdate = async (req,res,next) => {
    try{
        const {orderId} = req.params
        const updatedOrder = await Order.findByIdAndUpdate(orderId, {status : req.body.status}, {new: true} )

        res.status(200).send(updatedOrder)
    }catch(err){
        next(err)
    }
}