import Cart from "../models/Cart.js"
import createError from "../utils/createError.js"

export const createCart = async(req,res,next) => {
    try{

        const cart = await Cart.findOne({userId: req.userId})
        if((cart)){
            return res.status(201).send({message: "cart already exists!"})
        }
        const newCart = await Cart({
            ...req.body,
            userId: req.userId
        })

        await newCart.save()

        res.status(201).send(newCart)
        
    }catch(err){
        next(err)
    }
}

export const getUserCart = async(req,res,next) => {
    try{
        const userCart = await Cart.findOne({userId: req.userId})

        res.status(200).send(userCart)
    }catch(err){
        next(err)
    }
}
