const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const conversationService = require('../services/conversationService');

/* Authentication */
router.post('/register',async (req, res) =>  authService.register(req, res));
router.post('/login', async (req, res) => authService.login(req, res));

/* Conversations */
router.post('/conversations', async (req, res) => conversationService.createConversation(req, res));
router.get('/conversations', async (req, res) => conversationService.getConversations(req, res));

module.exports = router;