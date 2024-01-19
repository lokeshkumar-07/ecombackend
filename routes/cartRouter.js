import express from 'express'
import { verifyUser } from '../middleware/verifyUsers.js'
import { createCart, getUserCart } from '../controllers/carts.js'

const cartRoutes = express.Router()

cartRoutes.post('/create', verifyUser, createCart)
cartRoutes.get('/get', verifyUser, getUserCart )

export default cartRoutes