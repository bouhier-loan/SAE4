const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const conversationService = require('../services/conversationService');
const groupService = require('../services/groupService');
const messageService = require('../services/messageService');
const userService = require('../services/userService');

/* Authentication */
router.post('/register',async (req, res) =>  authService.register(req, res));
router.post('/login', async (req, res) => authService.login(req, res));
router.post('/logout', async (req, res) => authService.logout(req, res));
router.post('/auth/checkToken', async (req, res) => authService.checkToken(req, res));

/* Conversations */
router.post('/conversations', async (req, res) => conversationService.createConversation(req, res));
router.get('/conversations', async (req, res) => conversationService.getConversations(req, res));
router.get('/conversations/:id', async (req, res) => conversationService.getConversationById(req, res));
router.get('/conversations/:id/messages', async (req, res) => conversationService.getConversationMessages(req, res));

/* Groups */
router.post('/groups', async (req, res) => groupService.createGroup(req, res));
router.get('/groups', async (req, res) => groupService.getGroups(req, res));
router.get('/groups/:id', async (req, res) => groupService.getGroupById(req, res));
router.get('/groups/:id/messages', async (req, res) => groupService.getGroupMessages(req, res));
router.put('/groups/:id', async (req, res) => groupService.renameGroup(req, res));
router.delete('/groups/:id', async (req, res) => groupService.deleteGroup(req, res));
router.get('/groups/:id/users', async (req, res) => groupService.getGroupParticipants(req, res));
router.post('/groups/:id/users/add', async (req, res) => groupService.addParticipant(req, res));
router.delete('/groups/:id/users/remove', async (req, res) => groupService.removeParticipant(req, res));

/* Messages */
router.post('/messages', async (req, res) => messageService.createMessage(req, res));
router.put('/messages/:id', async (req, res) => messageService.updateMessage(req, res));
router.delete('/messages/:id', async (req, res) => messageService.deleteMessage(req, res));

/* Users */
router.get('/users', async (req, res) => userService.getAllUsers(req, res));
router.get('/users/:id', async (req, res) => userService.getUserInfo(req, res));
router.put('/users/:id', async (req, res) => userService.updateUser(req, res));

module.exports = router;