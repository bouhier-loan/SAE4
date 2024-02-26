const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const conversationService = require('../services/conversationService');
const messageService = require('../services/messageService');
const userService = require('../services/userService');

/* Authentication */
router.post('/register',async (req, res) =>  authService.register(req, res));
router.post('/login', async (req, res) => authService.login(req, res));
router.post('/logout', async (req, res) => authService.logout(req, res));

/* Conversations */
router.post('/conversations', async (req, res) => conversationService.createConversation(req, res));
router.get('/conversations', async (req, res) => conversationService.getConversations(req, res));
router.get('/conversations/:id', async (req, res) => conversationService.getConversationById(req, res));
router.get('/conversations/:id/messages', async (req, res) => conversationService.getConversationMessages(req, res));

/* Messages */
router.post('/messages', async (req, res) => messageService.createMessage(req, res));
router.put('/messages/:id', async (req, res) => messageService.updateMessage(req, res));
router.delete('/messages/:id', async (req, res) => messageService.deleteMessage(req, res));

/* Users */
router.get('/users', async (req, res) => userService.getAllUsers(req, res));
router.get('/users/:id', async (req, res) => userService.getUserInfo(req, res));
router.put('/users/:id', async (req, res) => userService.updateUserInfo(req, res));

module.exports = router;