const express = require('express');
const router = express.Router();

const messageService = require('../services/messageService');

/* Messages */
router.post('/messages', async (req, res) => { await messageService.createMessage(req, res) });
router.get('/messages', async (req, res) => { await messageService.getMessages(req, res) });
router.get('/messages/:id', async (req, res) => { await messageService.getMessage(req, res) });
router.delete('/messages/:id', async (req, res) => { await messageService.deleteMessage(req, res) });
router.put('/messages/:id', async (req, res) => { await messageService.updateMessage(req, res) });

/* Conversations */
router.get('/conversations', async (req, res) => { await messageService.getConversations(req, res) });
router.get('/conversations/:id', async (req, res) => { await messageService.getConversation(req, res) });
router.get('/conversations/:id/messages', async (req, res) => { await messageService.getConversationMessages(req, res) });
router.post('/conversations', async (req, res) => { await messageService.createConversation(req, res) });
router.delete('/conversations/:id', async (req, res) => { await messageService.deleteConversation(req, res) });
router.put('/conversations/:id', async (req, res) => { await messageService.updateConversation(req, res) });
router.post('/conversations/:id/participants', async (req, res) => { await messageService.addParticipant(req, res) });
router.delete('/conversations/:id/participants/:participantId', async (req, res) => { await messageService.removeParticipant(req, res) });
router.get('/conversations/:id/participants', async (req, res) => { await messageService.getParticipants(req, res) });

module.exports = router;