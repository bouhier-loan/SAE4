"use strict";
import express from 'express';
import {body} from 'express-validator';
import userController from '../controllers/userController.js';

const router = express.Router();

/* /Users */
router.post(
        '/login',
        body('username').isString().notEmpty(),
        body('password').isString().notEmpty(),
        async (req, res) => {await userController.login(req, res);}
);

router.route('/')
    .post(async (req, res) => {
        await userController.register(req, res);
    })
    .get(async (req, res) => {
        await userController.getAllUsers(req, res);
    });

router.route('/:id')
    .put(async (req, res) => {
        await userController.updateUser(req, res);
    })
    .get(async (req, res) => {
        await userController.getUser(req, res);
    });

export default router;