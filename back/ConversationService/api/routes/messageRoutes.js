const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');
const {body} = require("express-validator");

/* Messages */
router.route('/')
    .post(
        body('userId').isString().notEmpty(),
        body('conversationId').isString().notEmpty(),
        body('content').isObject().notEmpty(),
        body('content.message').isString().notEmpty().escape(),
        async (req, res) => { await messageController.createMessage(req, res) }
    )
    .get(
        async (req, res) => { await messageController.getMessages(req, res) }
    );

router.route('/:id')
    .get(
        async (req, res) => { await messageController.getMessage(req, res) }
    )
    .delete(
        async (req, res) => { await messageController.deleteMessage(req, res) }
    )
    .put(
        body('content').isObject().notEmpty(),
        body('content.message').isString().notEmpty().escape(),
        async (req, res) => { await messageController.updateMessage(req, res) }
    );

module.exports = router;