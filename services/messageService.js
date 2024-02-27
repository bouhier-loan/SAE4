const Conversation = require('../models/conversation');
const Message = require('../models/message');

const { v4: uuidv4 } = require('uuid');

/* Create a new message
 * @param {Object} req - The request object
 * @param {String} req.body.userId - The user's id
 * @param {String} req.body.conversationId - The conversation's id
 * @param {Object} req.body.content - The message's content
 * @param {String} req.body.content.message - The message's text
 * @param {Object} res - The response object
 * @return {Object} - The response object
 */
async function createMessage(req, res) {
    /* Check if the request is valid */
    if (!req.body.userId || !req.body.conversationId || !req.body.content) {
        return res.status(400).json(
            {
                message: 'Invalid request'
            }
        );
    }

    /* Check if the conversation exists */
    let conversation = await Conversation.findOne({id: req.body.conversationId});
    if (!conversation) {
        return res.status(404).json(
            {
                message: 'Conversation not found',
            }
        );
    }


    /* Check if the user is a participant in the conversation */
    if (!conversation.participants.includes(req.body.userId)) {
        return res.status(403).json(
            {
                message: 'The user is not a participant in the conversation',
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
    let { _id, __v, ...messageWithoutIdAndV } = message.toJSON();

    /* Send the response */
    return res.status(200).json(
        {
            message: 'Message created',
            createdMessage: messageWithoutIdAndV,
        }
    );
}

/* Modify message
 * @param {Object} req - The request object
 * @param {String} req.params.id - The message's id
 * @param {Object} req.body.content - The message's content
 * @param {String} req.body.content.message - The message's text
 * @param {Object} res - The response object
 */
async function updateMessage(req, res) {
    /* Check if the request is valid */
    if (!req.body.content.message) {
        return res.status(400).json(
            {
                message: 'Invalid request'
            }
        );
    }

    /* Check if the message exists */
    let message = await Message.findOne({id: req.params.id});
    if (!message) {
        return res.status(404).json(
            {
                message: 'Message not found',
            }
        );
    }

    /* Modify the message */
    message.content = req.body.content;
    message.modified = true;
    await message.save();

    /* Remove _id and __v from the message */
    let { _id, __v, ...messageWithoutIdAndV } = message.toJSON();

    /* Send the response */
    return res.status(200).json(
        {
            message: 'Message modified',
            modifiedMessage: messageWithoutIdAndV,
        }
    );
}

/* Delete a message
 * @param {Object} req - The request object
 * @param {String} req.params.id - The message's id
 * @param {Object} res - The response object
 */
async function deleteMessage(req, res) {
    /* Check if the message exists */
    let message = await Message.findOne({id: req.params.id});
    if (!message) {
        return res.status(404).json(
            {
                message: 'Message not found',
            }
        );
    }
    /* Delete the message */
    await message.deleteOne();

    /* Send the response */
    return res.status(200).json(
        {
            message: 'Message deleted',
        }
    );
}

/* Get all the messages
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Object} - The response object
 */
async function getMessages(req, res) {
    /* Get all the messages */
    let messages = await Message.find();

    /* Remove _id and __v from the messages */
    let messagesWithoutIdAndV = messages.map(message => {
        let { _id, __v, ...messageWithoutIdAndV } = message.toJSON();
        return messageWithoutIdAndV;
    });

    /* Send the response */
    return res.status(200).json(
        {
            messages: messagesWithoutIdAndV,
        }
    );
}

/* Get a message
 * @param {Object} req - The request object
 * @param {String} req.params.id - The message's id
 * @param {Object} res - The response object
 * @return {Object} - The response object
 */
async function getMessage(req, res) {
    /* Check if the message exists */
    let message = await Message.findOne({id: req.params.id});
    if (!message) {
        return res.status(404).json(
            {
                message: 'Message not found',
            }
        );
    }
    
    /* Remove _id and __v from the message */
    let { _id, __v, ...messageWithoutIdAndV } = message.toJSON();
    
    /* Send the response */
    return res.status(200).json(
        {
            message: messageWithoutIdAndV,
        }
    );
}

module.exports = {
    createMessage,
    updateMessage,
    deleteMessage,
    getMessages,
    getMessage
}