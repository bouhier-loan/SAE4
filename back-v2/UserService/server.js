"use strict"
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import router from 'api/routes/userRoutes.js';

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log("Connected to database"))

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/users',router);

app.listen(process.env.USER_SERVICE_PORT, () => console.log(`Service running on port ${process.env.USER_SERVICE_PORT}`));