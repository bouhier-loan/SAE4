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

/* Create a conversation
 * @param {Object} req - The request object
 * @param {String} req.body.ownerId - The owner's id
 * @param {Array} req.body.participants - The conversation's participant's ids
 * @param {String} req.body.name - The conversation's name
 * @param {Object} res - The response object
 */
async function createConversation(req, res) {
    /* Check if the request is valid */
    if (!req.body.ownerId || !req.body.participants || !req.body.name) {
        return res.status(400).json(
            {
                message: 'Invalid request'
            }
        );
    }

    /* Create a new conversation */
    let conversation = new Conversation({
        id: uuidv4(),
        ownerId: req.body.ownerId,
        participants: req.body.participants,
        name: req.body.name
    });

    /* Save the conversation */
    await conversation.save();

    /* Remove _id and __v from the conversation */
    let { _id, __v, ...conversationWithoutIdAndV } = conversation.toJSON();

    /* Send the response */
    return res.status(200).json(
        {
            message: 'Conversation created',
            createdConversation: conversationWithoutIdAndV,
        }
    );
}

/* Modify conversation
 * @param {Object} req - The request object
 * @param {String} req.params.id - The conversation's id
 * @param {String} req.body.name - The conversation's name
 * @param {Object} res - The response object
 */
async function updateConversation(req, res) {
    /* Check if the request is valid */
    if (!req.body.name) {
        return res.status(400).json(
            {
                message: 'Invalid request'
            }
        );
    }

    /* Check if the conversation exists */
    let conversation = await Conversation.findOne({id: req.params.id});
    if (!conversation) {
        return res.status(404).json(
            {
                message: 'Conversation not found',
            }
        );
    }

    /* Modify the conversation */
    conversation.name = req.body.name;
    await conversation.save();

    /* Remove _id and __v from the conversation */
    let { _id, __v, ...conversationWithoutIdAndV } = conversation.toJSON();

    /* Send the response */
    return res.status(200).json(
        {
            message: 'Conversation modified',
            modifiedConversation: conversationWithoutIdAndV,
        }
    );
}

/* Delete a conversation
 * @param {Object} req - The request object
 * @param {String} req.params.id - The conversation's id
 * @param {Object} res - The response object
 */
async function deleteConversation(req, res) {
    /* Check if the conversation exists */
    let conversation = await Conversation.findOne({id: req.params.id});
    if (!conversation) {
        return res.status(404).json(
            {
                message: 'Conversation not found',
            }
        );
    }

    /* Delete the conversation's messages */
    await Message.deleteMany({conversationId: conversation.id});

    /* Delete the conversation */
    await conversation.deleteOne();

    /* Send the response */
    return res.status(200).json(
        {
            message: 'Conversation deleted',
        }
    );
}

/* Get all the conversations
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Object} - The response object
 */
async function getConversations(req, res) {
    /* Get all the conversations */
    let conversations = await Conversation.find();

    /* Remove _id and __v from the conversations */
    let conversationsWithoutIdAndV = conversations.map(conversation => {
        let { _id, __v, ...conversationWithoutIdAndV } = conversation.toJSON();
        return conversationWithoutIdAndV;
    });

    /* Send the response */
    return res.status(200).json(
        {
            conversations: conversationsWithoutIdAndV,
        }
    );
}

/* Get a conversation
 * @param {Object} req - The request object
 * @param {String} req.params.id - The conversation's id
 * @param {Object} res - The response object
 * @return {Object} - The response object
 */
async function getConversation(req, res) {
    /* Check if the conversation exists */
    let conversation = await Conversation.findOne({id: req.params.id});
    if (!conversation) {
        return res.status(404).json(
            {
                message: 'Conversation not found',
            }
        );
    }

    /* Remove _id and __v from the conversation */
    let {_id, __v, ...conversationWithoutIdAndV} = conversation.toJSON();

    /* Send the response */
    return res.status(200).json(
        {
            conversation: conversationWithoutIdAndV,
        }
    );
}

/* Get a user's conversations
 * @param {Object} req - The request object
 * @param {String} req.params.id - The user's id
 * @param {Object} res - The response object
 * @return {Object} - The response object
 */
async function getUserConversations(req, res) {
    /* Get the user's conversations */
    let conversations = await Conversation.find({participants: req.params.id});

    /* Remove _id and __v from the conversations */
    let conversationsWithoutIdAndV = conversations.map(conversation => {
        let {_id, __v, ...conversationWithoutIdAndV} = conversation.toJSON();
        return conversationWithoutIdAndV;
    });

    /* Send the response */
    return res.status(200).json(
        {
            conversations: conversationsWithoutIdAndV,
        }
    );
}

/* Add a participant to a conversation
    * @param {Object} req - The request object
    * @param {String} req.params.id - The conversation's id
    * @param {String} req.body.participantId - The participant's id
    * @param {Object} res - The response object
    * @return {Object} - The response object
 */
async function addParticipant(req, res) {
    /* Check if the request is valid */
    if (!req.body.participantId) {
        return res.status(400).json(
            {
                message: 'Invalid request'
            }
        );
    }

    /* Check if the conversation exists */
    let conversation = await Conversation.findOne({id: req.params.id});
    if (!conversation) {
        return res.status(404).json(
            {
                message: 'Conversation not found',
            }
        );
    }

    /* Add the participant to the conversation */
    conversation.participants.push(req.body.participantId);
    await conversation.save();

    /* Remove _id and __v from the conversation */
    let { _id, __v, ...conversationWithoutIdAndV } = conversation.toJSON();

    /* Send the response */
    return res.status(200).json(
        {
            message: 'Participant added',
            modifiedConversation: conversationWithoutIdAndV,
        }
    );
}

/* Remove a participant from a conversation
    * @param {Object} req - The request object
    * @param {String} req.params.id - The conversation's id
    * @param {String} req.body.participantId - The participant's id
    * @param {Object} res - The response object
    * @return {Object} - The response object
 */
async function removeParticipant(req, res) {
    /* Check if the request is valid */
    if (!req.body.participantId) {
        return res.status(400).json(
            {
                message: 'Invalid request'
            }
        );
    }

    /* Check if the conversation exists */
    let conversation = await Conversation.findOne({id: req.params.id});
    if (!conversation) {
        return res.status(404).json(
            {
                message: 'Conversation not found',
            }
        );
    }

    /* Remove the participant from the conversation */
    conversation.participants = conversation.participants.filter(participant => participant !== req.body.participantId);
    await conversation.save();

    /* Remove _id and __v from the conversation */
    let { _id, __v, ...conversationWithoutIdAndV } = conversation.toJSON();

    /* Send the response */
    return res.status(200).json(
        {
            message: 'Participant removed',
            modifiedConversation: conversationWithoutIdAndV,
        }
    );
}

/* Get a conversation's messages
    * @param {Object} req - The request object
    * @param {String} req.params.id - The conversation's id
    * @param {Object} res - The response object
    * @return {Object} - The response object
 */
async function getConversationMessages(req, res) {
    /* Get the conversation's messages */
    let messages = await Message.find({conversationId: req.params.id});

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

/* Get a conversation's participants
    * @param {Object} req - The request object
    * @param {String} req.params.id - The conversation's id
    * @param {Object} res - The response object
    * @return {Object} - The response object
 */
async function getParticipants(req, res) {
    /* Get the conversation's participants */
    let conversation = await Conversation.findOne({id: req.params.id});
    if (!conversation) {
        return res.status(404).json(
            {
                message: 'Conversation not found',
            }
        );
    }

    /* Send the response */
    return res.status(200).json(
        {
            participants: conversation.participants,
        }
    );
}

module.exports = {
    /* Message */
    createMessage,
    updateMessage,
    deleteMessage,
    getMessages,
    getMessage,
    /* Conversation */
    createConversation,
    updateConversation,
    deleteConversation,
    getConversations,
    getConversation,
    getUserConversations,
    addParticipant,
    removeParticipant,
    getConversationMessages,
    getParticipants
}