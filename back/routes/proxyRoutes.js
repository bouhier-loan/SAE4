const express = require('express');
const usersRouter = express.Router();
const messagesRouter = express.Router();
const conversationsRouter = express.Router();

const proxyService = require('../services/proxyService');

/* /Users */
usersRouter.route('/login')
        .post(async (req, res) => {
            await proxyService.login(req, res);
        })

usersRouter.route('/')
        .post(async (req, res) => {
            await proxyService.register(req, res);
        })
        .get(async (req, res) => {
            await proxyService.getAllUsers(req, res);
        });

usersRouter.route('/:id')
        .put(async (req, res) => {
            await proxyService.updateUser(req, res);
        })
        .get(async (req, res) => {
            await proxyService.getUser(req, res);
        });

/* /Conversations */
conversationsRouter.route('/')
        .get(async (req, res) => {
            await proxyService.getAllConversations(req, res);
        })
        .post(async (req, res) => {
            await proxyService.createConversation(req, res);
        });

conversationsRouter.route('/:id')
        .get(async (req, res) => {
            await proxyService.getConversation(req, res);
        })
        .put(async (req, res) => {
            await proxyService.updateConversation(req, res);
        })
        .delete(async (req, res) => {
            await proxyService.deleteConversation(req, res);
        });

conversationsRouter.route('/:id/messages')
        .get(async (req, res) => {
            await proxyService.getConversationMessages(req, res);
        });

conversationsRouter.route('/:id/participants/add')
        .post(async (req, res) => {
            await proxyService.addParticipant(req, res);
        });

conversationsRouter.route('/:id/participants/remove')
        .post(async (req, res) => {
            await proxyService.removeParticipant(req, res);
        });

/* /Messages */
messagesRouter.route('/')
        .post(async (req, res) => {
            await proxyService.createMessage(req, res);
        });

messagesRouter.route('/:id')
        .put(async (req, res) => {
            await proxyService.updateMessage(req, res);
        })
        .delete(async (req, res) => {
            await proxyService.deleteMessage(req, res);
        });

module.exports = {
    usersRouter,
    conversationsRouter,
    messagesRouter
};