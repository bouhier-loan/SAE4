const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

console.log("Connecting to database")
mongoose.connect(process.env.DATABASE_URL, {

})
console.log("Connected to database")

const apiRoutes = require('./routes/routes')

// const publicRoutes = require('./routes/public')

app = express()

app.use(express.json())

//app.use('/public', cors())
//app.use('/public', publicRoutes)

console.log("Setting up routes")
app.use('/api', cors({
  credentials: true,
  origin: ['http://localhost:8000','http://127.0.0.1:8000'] // Add the frontend url here
}))
app.use('/api', apiRoutes)

app.listen(8000)
console.log('Server started')
