const express = require('express');
const userController = require('../controllers/userController');
const { body } = require('express-validator');

const router = express.Router();

router.post(
    '/',
    body('username').isString().isLength({min: 5, max: 20}).escape(),
    body('password').isString().isLength({min: 8}).escape(),
    async (req, res) => userController.createUser(req, res)
);
router.get(
    '/',
    async (req, res) => userController.getAllUsers(req, res)
);
router.put(
    '/:id',
    body('displayName').isString().isLength({min: 1, max: 20}).escape(),
    body('password').isString().isLength({min:8}).escape(),
    async (req, res) => userController.updateUser(req, res)
);
router.post(
    '/:id/token',
    async (req, res) => userController.createToken(req, res)
);
router.post(
    '/:id/token/check',
    body('token').isString().isLength({min: 1}).escape(),
    async (req, res) => userController.checkToken(req, res)
);
router.post(
    '/:id/password',
    body('password').isString().isLength({min: 8}).escape(),
    async (req, res) => userController.checkPassword(req, res)
);

module.exports = router;