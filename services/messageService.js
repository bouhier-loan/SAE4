const authService = require('./authService');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const Group = require('../models/group');

const { v4: uuidv4 } = require('uuid');

/* Create a new message
 * @param {Object} req - The request object
 * @param {String} req.body.token - The user's token
 * @param {String} req.body.userId - The user's id
 * @param {String} req.body.conversationId - The conversation's id
 * @param {String} req.body.text - The message's text
 * @param {Object} res - The response object
 * @return {Object} - The response object
 */
async function createMessage(req, res) {
    /* Check if the request is valid */
    if (!req.body.token || !req.body.userId || !req.body.conversationId || !req.body.content) {
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

    /* Check if the conversation exists */
    let conversation = await Conversation.findOne({id: req.body.conversationId});
    /* Else, check if the group exists */
    if (!conversation) {
        conversation = await Group.findOne({id: req.body.conversationId});
    }
    if (!conversation) {
        return res.status(404).json(
            {
                message: 'Conversation not found',
                token: newToken
            }
        );
    }


    /* Check if the user is a participant in the conversation */
    if (!conversation.participants.includes(req.body.userId)) {
        return res.status(403).json(
            {
                message: 'Forbidden',
                token: newToken
            }
        );
    }

    /* Create a new message */
    let message = new Message({
        id: uuidv4(),
        conversationId: conversation.id,
        senderId: req.body.userId,
        content: req.body.content
    });

    /* Save the message */
    await message.save();

    /* Update the conversation's lastUpdated field */
    conversation.lastUpdated = new Date();
    await conversation.save();

    /* Remove _id and __v from the message */
    let { _id, __v, ...messageWithoutIdAndV } = message.toObject();

    /* Send the response */
    return res.status(200).json(
        {
            message: 'Message created',
            createdMessage: messageWithoutIdAndV,
            token: newToken
        }
    );
}

/* Modify message
 * @param {Object} req - The request object
 * @param {String} req.body.token - The user's token
 * @param {String} req.body.userId - The user's id
 * @param {String} req.body.messageId - The message's id
 * @param {String} req.body.content - The message's content
 * @param {Object} res - The response object
 */
async function updateMessage(req, res) {
    /* Check if the request is valid */
    if (!req.body.token || !req.body.userId || !req.body.messageId || !req.body.content) {
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

    /* Check if the message exists */
    let message = await Message.findOne({id: req.body.messageId});
    if (!message) {
        return res.status(404).json(
            {
                message: 'Message not found',
                token: newToken
            }
        );
    }

    /* Check if the user is the sender of the message */
    if (message.jsonerId !== req.body.userId) {
        return res.status(403).json(
            {
                message: 'Forbidden',
                token: newToken
            }
        );
    }

    /* Modify the message */
    message.content = req.body.content;
    message.modified = true;
    await message.save();

    /* Remove _id and __v from the message */
    let { _id, __v, ...messageWithoutIdAndV } = message.toObject();

    /* Send the response */
    return res.status(200).json(
        {
            message: 'Message modified',
            modifiedMessage: messageWithoutIdAndV,
            token: newToken
        }
    );
}

async function deleteMessage(req, res) {
    /* Check if the request is valid */
    if (!req.body.token || !req.body.userId || !req.body.messageId) {
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

    /* Check if the message exists */
    let message = await Message.findOne({id: req.body.messageId});
    if (!message) {
        return res.status(404).json(
            {
                message: 'Message not found',
                token: newToken
            }
        );
    }

    /* Check if the user is the sender of the message */
    if (message.jsonerId !== req.body.userId) {
        return res.status(403).json(
            {
                message: 'Forbidden',
                token: newToken
            }
        );
    }

    /* Delete the message */
    await message.deleteOne();

    /* Send the response */
    return res.status(200).json(
        {
            message: 'Message deleted',
            token: newToken
        }
    );
}

module.exports = {
    createMessage,
    updateMessage,
    deleteMessage
}