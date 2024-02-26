const authService = require('./authService');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const Message = require("../models/message");
const { v4: uuidv4 } = require('uuid');

/* Create a new conversation
 * @param {Object} req - The request object
 *  @param {String} req.body.token - The user's token
 *  @param {String} req.body.userId - The user's id
 *  @param {String} req.body.otherUserId - The other user's id
 * @param {Object} res - The response object
 * @return {Object} - The response object
 */
async function createConversation(req, res) {
    /* Check if the request is valid */
    if (!req.body.token || !req.body.otherUserId || !req.body.userId) {
        return res.status(400).json(
            {
                message: 'Invalid request'
            }
        );
    }

    /* Check if the user is authenticated */
    let newToken = await authService.refreshToken(req.body.token, req.body.userId);
    if (!newToken) {
        return res.status(401).json(
            {
                message: 'Unauthorized'
            }
        );
    }

    /* Check if the user exists */
    let otherUser = await User.findOne({id: req.body.otherUserId})
    if (!otherUser) {
        return res.status(404).json(
            {
                message: 'User not found',
                token: newToken
            }
        );
    }

    /* Check if the user is the same as the other user */
    if (req.body.userId === otherUser.id) {
        return res.status(400).json(
            {
                message: 'You cannot create a conversation with yourself',
                token: newToken
            }
        );
    }

    /* Check if the conversation already exists */
    let conversation = await Conversation.findOne({participants: [req.body.userId, otherUser.id]});
    if (conversation) {
        return res.status(400).json(
            {
                message: 'Conversation already exists',
                conversation: conversation,
                token: newToken
            }
        );
    }

    /* Create a new conversation */
    conversation = new Conversation({
        id: uuidv4(),
        participants: [req.body.userId, otherUser.id]
    });
    await conversation.save();

    let {_id, __v, ...conversationWithoutId} = conversation.toObject();

    return res.status(201).json(
        {
            message: 'Conversation created',
            conversation: conversationWithoutId,
            token: newToken
        }
    );
}

async function getConversations(req, res) {
    /* Check if the request is valid */
    if (!req.body.token || !req.body.userId) {
        return res.status(400).json(
            {
                message: 'Invalid request'
            }
        );
    }

    /* Check if the user is authenticated */
    let newToken = await authService.refreshToken(req.body.token, req.body.userId);
    if (!newToken) {
        return res.status(401).json(
            {
                message: 'Unauthorized'
            }
        );
    }

    /* Get the user's conversations */
    let conversations = await Conversation.find({participants: req.body.userId});

    /* Clean the conversations */
    conversations = conversations.map(conversation => {
        /* Remove the id and version fields */
        let {_id, __v, ...conversationWithoutId} = conversation.toObject();
        return conversationWithoutId;
    });

    return res.status(200).json(
        {
            message: 'Conversations found',
            conversations: conversations,
            token: newToken
        }
    );
}

async function getConversationById(req, res) {
    /* Check if the request is valid */
    if (!req.body.token || !req.body.userId) {
        return res.status(400).json(
            {
                message: 'Invalid request'
            }
        );
    }

    /* Check if the user is authenticated */
    let newToken = await authService.refreshToken(req.body.token, req.body.userId);
    if (!newToken) {
        return res.status(401).json(
            {
                message: 'Unauthorized'
            }
        );
    }

    /* Get the conversation */
    let conversation = await Conversation.findOne({id: req.params.id});
    if (!conversation) {
        return res.status(404).json(
            {
                message: 'Conversation not found',
                token: newToken
            }
        );
    }

    /* Check if the user is a participant */
    if (!conversation.participants.includes(req.body.userId)) {
        return res.status(403).json(
            {
                message: 'Forbidden',
                token: newToken
            }
        );
    }

    /* Remove the id and version fields */
    let {_id, __v, ...conversationWithoutId} = conversation.toObject();

    return res.status(200).json(
        {
            message: 'Conversation found',
            conversation: conversationWithoutId,
            token: newToken
        }
    );
}

async function getConversationMessages(req, res) {
    /* Check if the request is valid */
    if (!req.body.token || !req.body.userId) {
        return res.status(400).json(
            {
                message: 'Invalid request'
            }
        );
    }

    /* Check if the user is authenticated */
    let newToken = await authService.refreshToken(req.body.token, req.body.userId);
    if (!newToken) {
        return res.status(401).json(
            {
                message: 'Unauthorized'
            }
        );
    }

    /* Get the conversation */
    let conversation = await Conversation.findOne({id: req.params.id});
    if (!conversation) {
        return res.status(404).json(
            {
                message: 'Conversation not found',
                token: newToken
            }
        );
    }

    /* Check if the user is a participant */
    if (!conversation.participants.includes(req.body.userId)) {
        return res.status(403).json(
            {
                message: 'Forbidden',
                token: newToken
            }
        );
    }

    /* Get the conversation's messages */
    let messages = await Message.find({conversationId: req.params.id});

    /* Remove the id and version fields */
    messages = messages.map(message => {
        let {_id, __v, ...messageWithoutId} = message.toObject();
        return messageWithoutId;
    });

    return res.status(200).json(
        {
            message: 'Messages found',
            messages: messages,
            token: newToken
        }
    );
}

module.exports = {
    createConversation,
    getConversations,
    getConversationById,
    getConversationMessages
}