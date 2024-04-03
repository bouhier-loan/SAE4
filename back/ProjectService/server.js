"use strict"
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const taskRouter = require('./api/routes/taskRoutes');
const projectRouter = require('./api/routes/projectRoutes');

dotenv.config();

mongoose.connect(process.env.DATABASE_URL, {})
    .then(() => console.log("Connected to database"))

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/tasks', taskRouter);
app.use('/projects', projectRouter);

/* Documentation (doc.yaml) */
app.use('/doc', swaggerUi.serve, swaggerUi.setup(YAML.load('doc.yaml')));


app.listen(process.env.CONVERSATION_SERVICE_PORT, () => console.log(`Service running on port ${process.env.CONVERSATION_SERVICE_PORT}`));
console.log('Started...');