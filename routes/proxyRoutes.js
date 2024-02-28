const express = require('express');
const router = express.Router();

const proxyService = require('../services/proxyService');

router.post('users/login', async (req, res) => proxyService.login(req, res));

module.exports = router;