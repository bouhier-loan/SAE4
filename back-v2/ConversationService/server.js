"use strict"
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import messageRouter from './api/routes/messageRoutes.js';
import conversationsRouter from './api/routes/conversationRoutes.js';
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log("Connected to database"))

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/messages', messageRouter);
app.use('/conversations', conversationsRouter);

app.listen(process.env.CONVERSATION_SERVICE_PORT, () => console.log(`Service running on port ${process.env.CONVERSATION_SERVICE_PORT}`));