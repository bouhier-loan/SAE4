const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const userRouter = require('./api/routes/userRoutes');
const conversationRouter = require('./api/routes/conversationRoutes');
const messageRouter = require('./api/routes/messageRoutes');
//const projectRouter = require('./api/routes/projectRoutes');
const serverRouter = require('./api/routes/serverRoutes');

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/users', userRouter);
app.use('/conversations', conversationRouter);
app.use('/messages', messageRouter);
//app.use('/projects', projectRouter);
app.use('/', serverRouter);

/* Documentation (doc.yaml) */
app.use('/doc', swaggerUi.serve, swaggerUi.setup(YAML.load('./doc.yaml')));


app.listen(process.env.PROXY_SERVICE_PORT, () => console.log(`Service running on port ${process.env.PROXY_SERVICE_PORT}`));