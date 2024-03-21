"use strict";
const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authenticator = require('../middlewares/authenticator');

const router = express.Router();

/* /Users */
router.post(
        '/login',
        body('username').isString().notEmpty(),
        body('password').isString().notEmpty(),
        async (req, res) => {await userController.login(req, res)}
);

router.route('/')
    .post(
        body('username').isString().isLength({min: 5, max: 20}).escape(),
        body('password').isString().isLength({min: 8}).escape(),
        async (req, res) => {await userController.register(req, res)}
    )
    .get(
        async (req, res) => {await userController.getAllUsers(req, res)}
    );

router.put(
    '/:id',
    body('displayName').isString().optional().escape(),
    body('password').isString().isLength({min:8}).optional().escape(),
    authenticator,
    async (req, res) => {await userController.updateUser(req, res);}
)

module.exports = router;