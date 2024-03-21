const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRouter = require('./api/routes/userRoutes');
const conversationRouter = require('./api/routes/conversationRoutes');
const messageRouter = require('./api/routes/messageRoutes');

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/users', userRouter);
app.use('/conversations', conversationRouter);
app.use('/messages', messageRouter);


app.listen(process.env.PROXY_SERVICE_PORT, () => console.log(`Service running on port ${process.env.PROXY_SERVICE_PORT}`));