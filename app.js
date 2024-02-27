const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

console.log("Connecting to database")
mongoose.connect(process.env.DATABASE_URL, {

})
console.log("Connected to database")

/* User routes */

const userRoutes = require('./routes/userRoutes')

userapp = express()
userapp.use(express.json())

console.log("Setting up user routes")
userapp.use('/', cors())
userapp.use('/', userRoutes)

userapp.listen(8001)
console.log('User server started')

/* Message routes */

const messageRoutes = require('./routes/messageRoutes')

messageapp = express()
messageapp.use(express.json())

console.log("Setting up message routes")
messageapp.use('/', cors())
messageapp.use('/', messageRoutes)

messageapp.listen(8002)
console.log('Message server started')