"use strict";
const express = require('express');
const { body } = require('express-validator');
const conversationController = require('../controllers/conversationController');
const authenticator = require('../middlewares/authenticator');

const router = express.Router();

/* /Conversations */

router.route('/')
    .get(
        authenticator,
        async (req, res) => {await conversationController.getAllConversations(req, res);}
    )
    .post(
        authenticator,
        body('participants').notEmpty().isArray().withMessage('Participants must be an array'),
        body('participants.*').isString().withMessage('Participants must be strings'),
        body('participants').custom((value, {req}) => {
            if (value.length < 2) {
                throw new Error('Conversations must have at least 2 participants');
            }
            return true;
        }),
        body('participants').custom((value, {req}) => {
            if (value.includes(req.userId)) {
                throw new Error('Participants must not include the user');
            }
            return true;
        }),
        body('participants').custom((value, {req}) => {
            if (value.length !== new Set(value).size) {
                throw new Error('Participants must be unique');
            }
            return true;
        }),
        body('name').optional().isString().notEmpty().withMessage('Name must be a non-empty string'),
        async (req, res) => {await conversationController.createConversation(req, res);}
    );

router.route('/:id')
    .put(
        authenticator,
        body('name').optional().isString().notEmpty().withMessage('Name must be a non-empty string'),
        async (req, res) => {await conversationController.updateConversation(req, res);}
    )
    .delete(
        authenticator,
        async (req, res) => {await conversationController.deleteConversation(req, res);}
    );

router.route('/:id/messages')
    .get(
        authenticator,
        async (req, res) => {await conversationController.getConversationMessages(req, res);}
    );

router.route('/:id/participants')
    .post(
        authenticator,
        body('participantId').isString().notEmpty().withMessage('Participant must be a string'),
        async (req, res) => {await conversationController.addParticipant(req, res);}
    );

router.route('/:id/participants/:participant')
    .delete(
        authenticator,
        async (req, res) => {await conversationController.removeParticipant(req, res);}
    );


module.exports = router;