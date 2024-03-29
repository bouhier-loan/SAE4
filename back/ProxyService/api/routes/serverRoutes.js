const express = require('express');
const {body, param, query} = require('express-validator');
const serverController = require('../controllers/serverController');
const authenticator = require('../middlewares/authenticator');

const router = express.Router();

router.get('/status/:fetch?',
    authenticator,
    param('fetch').optional().isBoolean(),
    serverController.fetchServerStatus
);

module.exports = router;