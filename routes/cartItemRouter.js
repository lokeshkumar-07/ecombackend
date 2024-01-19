import express from 'express'
import { verifyUser } from '../middleware/verifyUsers.js'
import { createCartItem, decrementItem, getUserCartItems, incrementItem, removeCartItem } from '../controllers/cartItem.js'

const cartItemRoutes = express.Router()

cartItemRoutes.post('/create', verifyUser, createCartItem )
cartItemRoutes.post('/increment', verifyUser, incrementItem )
cartItemRoutes.post('/decrement', verifyUser, decrementItem)
cartItemRoutes.get('/get/:cartId', verifyUser, getUserCartItems)
cartItemRoutes.delete('/remove', verifyUser, removeCartItem)

export default cartItemRoutes