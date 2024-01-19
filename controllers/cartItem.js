import Cart from "../models/Cart.js"
import CartItem from "../models/CartItem.js"
import Product from "../models/Product.js"

export const createCartItem = async(req,res,next) => {
    try{
        const {productId, cartId} = req.body

        const product = await Product.findById(productId)

        const cartItem = new CartItem({
            cartId: cartId,
            productId : productId,
            userId : req.userId,
            quantity : 1,
            price : product.price,
            unit: product.unit,
            totalStock: product.stock,
            productName: product.name,
            category: product.category,
            images: product.images
        })

        await cartItem.save()

        const cart = await Cart.findById(cartId)

        cart.totalPrice = cart.totalPrice + product.price
        await cart.save()

        res.status(201).send(cartItem)
    }catch(err){
        next(err)
    }
}

export const incrementItem = async(req,res,next) => {
    
    try{
        const {productId, cartId} = req.body

        const cartIt = await CartItem.findOne({productId: productId, cartId: cartId})

        
        
        cartIt.quantity = cartIt.quantity + 1

        await cartIt.save()
        const cart = await Cart.findById(cartId)
        
        cart.totalPrice = cart.totalPrice + cartIt.price

        await cart.save()
        
        res.status(200).send("Cart Incremented")
        
    }catch(err){
        next(err)
    }
}

export const decrementItem = async(req,res,next) => {
    try{
        const {productId, cartId} = req.body
        
        const cartIt = await CartItem.findOne({productId: productId, cartId: cartId})
        
        cartIt.quantity = cartIt.quantity - 1

        await cartIt.save()
        const cart = await Cart.findById(cartId)
        
        cart.totalPrice = cart.totalPrice - cartIt.price

        await cart.save()
        
        res.status(200).send("Cart Decremented")
        
    }catch(err){
        next(err)
    }
}

export const removeCartItem = async (req,res,next) => {
    try{

        const {productId, cartId, id} = req.body


        const cartIt1 = await CartItem.findOne({productId: productId, cartId: cartId})
        
        const cart = await Cart.findOne({_id: cartId})
    
        cart.totalPrice = cart.totalPrice - cartIt1.quantity *  cartIt1.price

        const cartIt = await CartItem.findByIdAndDelete(id)


        await cart.save()

        res.status(200).send("cart Removed")

        
    }catch(err){
        next(err)
    }
}

export const getUserCartItems = async (req,res,next) => {
    try{
        
        const cartItems = await CartItem.find({cartId : req.params.cartId})

        res.status(200).send(cartItems)
        
    }catch(err){
        next(err)
    }
}