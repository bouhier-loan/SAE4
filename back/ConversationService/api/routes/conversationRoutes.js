const express = require('express');
const router = express.Router();

const conversationController = require('../controllers/conversationController.js');
const {body} = require("express-validator");

/* Conversations */
router.get(
    '/',
    async (req, res) => { await conversationController.getConversations(req, res) }
);
router.get(
    '/:id',
    async (req, res) => { await conversationController.getConversation(req, res) }
);
router.get(
    '/:id/messages',
    body('userId').isString().notEmpty().withMessage('User id must be a string'),
    async (req, res) => { await conversationController.getConversationMessages(req, res) }
);

router.get(
    '/:id/messages/fetch',
    body('userId').isString().notEmpty().withMessage('User id must be a string'),
    async (req, res) => { await conversationController.getUnreadMessages(req, res) }
);

router.post(
    '/',
    body('participants').isArray().withMessage('Participants must be an array'),
    body('participants.*').isString().notEmpty().withMessage('Participants must be strings'),
    body('participants').custom((value) => {
        if (value.length < 2) {
            throw new Error('A conversation must have at least 2 participants');
        }
        return true;
    }, 'A conversation must have at least 2 participants'),
    body('participants').custom((value) => {
        if (new Set(value).size !== value.length) {
            throw new Error('A conversation must have unique participants');
        }
        return true;
    }, 'A conversation must have unique participants'),
    body('ownerId').isString().notEmpty().withMessage('Owner id must be a string'),
    body('ownerId').custom((value, {req}) => {
        if (!req.body.participants.includes(value)) {
            throw new Error('The owner must be a participant');
        }
        return true;
    }, 'The owner must be a participant'),
    body('name').isString().notEmpty().escape().withMessage('Name must be a string'),
    async (req, res) => { await conversationController.createConversation(req, res) }
);
router.delete(
    '/:id',
    async (req, res) => { await conversationController.deleteConversation(req, res) }
);
router.put(
    '/:id',
    body('name').isString().notEmpty().escape().withMessage('Name must be a string'),
    async (req, res) => { await conversationController.updateConversation(req, res) }
);
router.post(
    '/:id/participants',
    body('participantId').isString().notEmpty().withMessage('Participant id must be a string'),
    async (req, res) => { await conversationController.addParticipant(req, res) }
);
router.delete(
    '/:id/participants/:participantId',
    body('participantId').isString().notEmpty().withMessage('Participant id must be a string'),
    async (req, res) => { await conversationController.removeParticipant(req, res) }
);
router.get(
    '/:id/participants',
    async (req, res) => { await conversationController.getParticipants(req, res) }
);

module.exports = router;