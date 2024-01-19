import express from 'express'
import { verifyAdmin, verifyUser } from '../middleware/verifyUsers.js'
import { createOrder, getAllOrders, getUserOrders, orderUpdate} from '../controllers/order.js'

const orderRoutes = express.Router()

orderRoutes.post('/place', verifyUser, createOrder)
orderRoutes.get('/get', verifyUser, getUserOrders)
orderRoutes.get('/all', verifyUser, getAllOrders)
orderRoutes.put('/update/:orderId', verifyUser, verifyAdmin, orderUpdate)

export default orderRoutes