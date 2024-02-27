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

module.exports = router;