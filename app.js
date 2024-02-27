const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

console.log("Connecting to database")
mongoose.connect(process.env.DATABASE_URL, {

})
console.log("Connected to database")

const userRoutes = require('./routes/userRoutes')

userapp = express()
userapp.use(express.json())

console.log("Setting up user routes")
userapp.use('/', cors())
userapp.use('/', userRoutes)

userapp.listen(8001)
console.log('User server started')

// TODO: Add a route for the messages service