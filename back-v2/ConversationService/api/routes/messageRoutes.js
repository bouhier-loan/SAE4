const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');
const {body} = require("express-validator");

/* Messages */
router.post(
    '/messages',
    body('senderId').isString().notEmpty(),
    body('conversationId').isString().notEmpty(),
    body('content').isObject().notEmpty(),
    body('content.message').isString().notEmpty().escape(),
    async (req, res) => { await messageController.createMessage(req, res) }
);
router.get(
    '/',
    async (req, res) => { await messageController.getMessages(req, res) }
);
router.get(
    '/:id',
    async (req, res) => { await messageController.getMessage(req, res) }
);
router.delete(
    '/:id',
    async (req, res) => { await messageController.deleteMessage(req, res) }
);
router.put(
    '/:id',
    body('content').isObject().notEmpty(),
    body('content.message').isString().notEmpty().escape(),
    async (req, res) => { await messageController.updateMessage(req, res) }
);

module.exports = router;