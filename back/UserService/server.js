const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const router = require('./api/routes/userRoutes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

dotenv.config();

mongoose.connect(process.env.DATABASE_URL, {}).then(() => console.log("Connected to database"))

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/users',router);

/* Documentation (doc.yaml) */
app.use('/doc', swaggerUi.serve, swaggerUi.setup(YAML.load('doc.yaml')));

app.listen(process.env.USER_SERVICE_PORT, () => console.log(`Service running on port ${process.env.USER_SERVICE_PORT}`));
console.log('Started...');