const express = require('express');
const {query} = require('express-validator');
const serverController = require('../controllers/serverController');
const authenticator = require('../middlewares/authenticator');

const router = express.Router();

router.get('/status/:fetch?',
    authenticator,
    query('fetch').isBoolean().default(false),
    serverController.fetchServerStatus
);

module.exports = router;