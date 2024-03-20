"use strict"
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRouter from './api/routes/userRoutes.js';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/users', userRouter);
app.listen(process.env.PROXY_SERVICE_PORT, () => console.log(`Service running on port ${process.env.PROXY_SERVICE_PORT}`));