import express from 'express'
import { verifyAdmin, verifyUser } from '../middleware/verifyUsers.js'
import { createProduct, getAllProduct, getProduct, updateProduct } from '../controllers/products.js'

const productsRoutes = express.Router()

productsRoutes.post('/new', verifyUser, verifyAdmin, createProduct)
productsRoutes.get('/get', getAllProduct)
productsRoutes.get('/get/:productId', getProduct)
productsRoutes.put('/update/:productId', verifyUser, verifyAdmin, updateProduct)

export default productsRoutes