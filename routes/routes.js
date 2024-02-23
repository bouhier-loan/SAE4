const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

/* Authentication */
router.post('/register', authService.register);
router.post('/login', authService.login);

module.exports = router;