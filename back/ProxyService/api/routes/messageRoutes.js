"use strict";
const express = require('express');
const { body } = require('express-validator');
const messageController = require('../controllers/messageController');
const authenticator = require('../middlewares/authenticator');

const router = express.Router();

router.route('/')
    .post(
        authenticator,
        body('content').isObject().withMessage('Content must be an object'),
        body('content.message').isString().withMessage('Message must be a string'),
        body('senderId').isString().withMessage('Sender ID must be a string'),
        body('conversationId').isString().withMessage('Conversation ID must be a string'),
        async (req, res) => {await messageController.sendMessage(req, res);}
    );

router.route('/:id')
    .put(
        authenticator,
        body('content').isObject().withMessage('Content must be an object'),
        body('content.message').isString().withMessage('Message must be a string'),
        async (req, res) => {await messageController.editMessage(req, res);}
    )
    .delete(
        authenticator,
        async (req, res) => {await messageController.deleteMessage(req, res);}
    );

module.exports = router;
