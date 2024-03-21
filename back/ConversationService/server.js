"use strict"
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const messageRouter = require('./api/routes/messageRoutes');
const conversationsRouter = require('./api/routes/conversationRoutes');

dotenv.config();

mongoose.connect(process.env.DATABASE_URL, {})
    .then(() => console.log("Connected to database"))

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/messages', messageRouter);
app.use('/conversations', conversationsRouter);

/* Documentation (doc.yaml) */
app.use('/doc', swaggerUi.serve, swaggerUi.setup(YAML.load('doc.yaml')));


app.listen(process.env.CONVERSATION_SERVICE_PORT, () => console.log(`Service running on port ${process.env.CONVERSATION_SERVICE_PORT}`));