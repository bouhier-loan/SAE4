const express = require('express');
const router = express.Router();

const userService = require('../services/userService');

router.post('/users', async (req, res) => userService.createUser(req, res));
router.get('/users', async (req, res) => userService.getAllUsers(req, res));
router.put('/users/:id', async (req, res) => userService.updateUser(req, res));
router.post('/users/:id/token', async (req, res) => userService.createToken(req, res));
router.get('/users/:id/token', async (req, res) => userService.checkToken(req, res));
router.post('/users/:id/password', async (req, res) => userService.checkPassword(req, res));

module.exports = router;