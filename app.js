// express
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

const start = async () => {
  try {
    app.listen(PORT, console.log('Server is listening on ' + PORT))
  } catch (error) {
    console.log(error)
  }
}

start()
