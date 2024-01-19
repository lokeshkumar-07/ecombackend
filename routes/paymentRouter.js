import express from 'express'
import { verifyAdmin, verifyUser } from '../middleware/verifyUsers.js'
import { processPayment, sendStripeApiKey } from '../controllers/paymentController.js'

const paymentRoutes = express.Router()

paymentRoutes.post('/process', verifyUser, processPayment)

export default paymentRoutes