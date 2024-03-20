const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRouter = require('./api/routes/userRoutes');

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/users', userRouter);
app.listen(process.env.PROXY_SERVICE_PORT, () => console.log(`Service running on port ${process.env.PROXY_SERVICE_PORT}`));