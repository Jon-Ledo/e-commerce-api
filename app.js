require('dotenv').config()
require('express-async-errors')

// express
const express = require('express')
const app = express()

// other packages
const morgan = require('morgan')

// database
const connectDB = require('./db/connect')

//routers
const authRouter = require('./routes/authRoutes')

//middlewares
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(morgan('tiny'))
app.use(express.json())

// route
app.get('/', (req, res) => {
  res.send('e-comerce api')
})

app.use('/api/v1/auth', authRouter)

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
