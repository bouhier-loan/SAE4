const Conversation = require('../models/conversation.js');
const Message = require('../models/message.js');

const { v4: uuidv4 } = require('uuid');
const {matchedData} = require("express-validator");

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
    const data = matchedData(req);

    /* Check if the conversation exists */
    let conversation = await Conversation.findOne({id: data.conversationId});
    if (!conversation) {
        return res.status(404).json(
            {
                message: 'Conversation not found',
            }
        );
    }


    /* Check if the user is a participant in the conversation */
    if (!conversation.participants.includes(data.userId)) {
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
        senderId: data.userId,
        content: data.content,
        seenBy: []
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
    const data = matchedData(req);

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
    message.content = data.content;
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

    /* Replace the message's content with a deletion message */
    message.content = {
        message: 'MESSAGE_DELETED',
        senderId: message.senderId,
    }

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