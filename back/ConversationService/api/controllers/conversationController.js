const Conversation = require('../models/conversation.js');
const Message = require('../models/message.js');

const { v4: uuidv4 } = require('uuid');
const {matchedData} = require("express-validator");

/* Valid colors for conversations */
const colors = [
    'CF4920',
    '638404',
    '007EA8',
    '4032DC',
    '8219D4',
    'CB3668',
    '00632B',
    '976400',
    'B01212',
    '4A4A4A',
]

/* Create a conversation
 * @param {Object} req - The request object
 * @param {String} req.body.ownerId - The owner's id
 * @param {Array} req.body.participants - The conversation's participant's ids
 * @param {String} req.body.name - The conversation's name
 * @param {Object} res - The response object
 */
async function createConversation(req, res) {
    const data = matchedData(req);

    /* Create a new conversation */
    let conversation = new Conversation({
        id: uuidv4(undefined, undefined, undefined),
        ownerId: data.ownerId,
        participants: data.participants,
        name: data.name,
        lastUpdated: new Date(),
        color: colors[Math.floor(Math.random() * colors.length)]
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
    const data = matchedData(req);

    /* Check if the conversation exists */
    let conversation = await Conversation.findOne({id: req.params.id});
    if (!conversation) {
        return res.status(404).json(
            {
                message: 'Conversation not found',
            }
        );
    }

    /* Create a new message */
    let message = new Message({
        id: uuidv4(),
        conversationId: conversation.id,
        senderId: 'system',
        content: {
            message: `CONVERSATION_UPDATE`,
            new_name: data.name,
            old_name: conversation.name,
        },
        seenBy: [],
    });

    /* Save the message */
    await message.save();

    /* Modify the conversation */
    conversation.name = data.name;
    /* Update the conversation's lastUpdated field */

    conversation.lastUpdated = new Date();
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
 * @param {String} req.query.userId - The user's id (optional)
 * @param {Object} res - The response object
 * @return {Object} - The response object
 */
async function getConversations(req, res) {
    /* Get all the conversations */
    let conversations = await Conversation.find();

    /* If the user's id is provided, filter the conversations */
    if (req.query.userId) {
        conversations = conversations.filter(conversation => conversation.participants.includes(req.query.userId));
    }

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

/* Add a participant to a conversation
    * @param {Object} req - The request object
    * @param {String} req.params.id - The conversation's id
    * @param {String} req.body.participantId - The participant's id
    * @param {Object} res - The response object
    * @return {Object} - The response object
 */
async function addParticipant(req, res) {
    const data = matchedData(req);

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
    conversation.participants.push(data.participantId);

    /* Update the conversation's lastUpdated field */
    conversation.lastUpdated = new Date();
    await conversation.save();

    /* Create a new message */
    let message = new Message({
        id: uuidv4(),
        conversationId: conversation.id,
        senderId: 'system',
        content: {
            message: `PARTICIPANT_ADDED`,
            participantId: data.participantId,
        },
        seenBy: [],
    });

    /* Save the message */
    await message.save();

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
    const data = matchedData(req);

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
    conversation.participants = conversation.participants.filter(participant => participant !== req.params.participantId);

    /* Update the conversation's lastUpdated field */
    conversation.lastUpdated = new Date();
    await conversation.save();

    /* Create a new message */
    let message = new Message({
        id: uuidv4(),
        conversationId: conversation.id,
        senderId: 'system',
        content: {
            message: `PARTICIPANT_REMOVED`,
            participantId: req.params.participantId,
        },
        seenBy: [],
    });

    /* Save the message */
    await message.save();

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

    /* Mark the messages as read */
    messages.forEach(async message => {
        if (!message.seenBy.includes(req.body.userId)) {
            message.seenBy.push(req.body.userId);
            await message.save();
        }
    })

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

/* Conversation message fetch (only sends messages that the user has not seen)
    * @param {Object} req - The request object
    * @param {String} req.params.id - The conversation's id
    * @param {Object} res - The response object
    * @return {Object} - The response object
 */
async function getUnreadMessages(req, res) {
    /* Get the conversation's messages */
    let messages = await Message.find({conversationId: req.params.id});

    /* Filter the messages */
    messages = messages.filter(message => !message.seenBy.includes(req.params.userId));

    /* Mark the messages as read */
    messages.forEach(async message => {
        if (!message.seenBy.includes(req.params.userId)) {
            message.seenBy.push(req.params.userId);
            await message.save();
        }
    })

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

module.exports = {
    createConversation,
    updateConversation,
    deleteConversation,
    getConversations,
    getConversation,
    addParticipant,
    removeParticipant,
    getConversationMessages,
    getParticipants,
    getUnreadMessages
}