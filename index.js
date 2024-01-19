import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cloudinary from 'cloudinary'
import fileUpload from 'express-fileupload'
import userRoutes from './routes/userRouter.js'
import productsRoutes from './routes/productRouter.js'
import cartRoutes from './routes/cartRouter.js'
import cartItemRoutes from './routes/cartItemRouter.js'
import orderRoutes from './routes/orderRouter.js'
import paymentRoutes from './routes/paymentRouter.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3001
const MONGO_URL = process.env.MONGO_URL

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.use(express.json())
app.use(cors())
app.use(express.json({ limit: "100mb" })); app.use(express.urlencoded({ limit: "100mb", extended: true }))
app.use(fileUpload())

//routes
app.use('/api/auth', userRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/carts', cartRoutes)
app.use('/api/cartitems', cartItemRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)

app.use((err,req,res,next) => {
    const errStatus = err.status || 500
    const errMessage = err.message || 'Something went wrong!'
    
    res.status(errStatus).json({
        status: errStatus,
        success: false,
        message: errMessage,
        stack: err.stack
    })
})

mongoose.connect(MONGO_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true
})
.then(() => {
    app.listen(PORT, () => console.log(`Server Running on port: ${PORT}`))
})




