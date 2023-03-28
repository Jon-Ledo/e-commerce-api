require('dotenv').config()
require('express-async-errors')

// express
const express = require('express')
const app = express()
const path = require('path')

// other packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

// database
const connectDB = require('./db/connect')

//routers
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const orderRouter = require('./routes/orderRoutes')

//middlewares
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static('./public'))
app.use(fileUpload())

// route
app.get('/', (req, res) => {
  res.send('e-comerce api')
})

app.get('/api/v1', (req, res) => {
  // console.log(req.cookies)
  console.log(req.signedCookies)
  res.send('e-comerce api')
})

// API docs
app.get('/api/v1/docs', (req, res) => {
  res.sendFile(path.join(__dirname, './docgen/index.html'))
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// start the server
const PORT = process.env.PORT || 5000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)

    app.listen(PORT, console.log('Server is listening on ' + PORT))
  } catch (error) {
    console.log(error)
  }
}

start()
