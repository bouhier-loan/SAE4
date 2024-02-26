const authService = require('./authService');
const User = require('../models/user');
const Conversation = require('../models/conversation');

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
        return res.status(400).send(
            {
                message: 'Invalid request'
            }
        );
    }

    /* Check if the user is authenticated */
    let newToken = await authService.refreshToken(req.body.token, req.body.userId);
    if (!newToken) {
        return res.status(401).send(
            {
                message: 'Unauthorized'
            }
        );
    }

    /* Check if the user exists */
    let otherUser = await User.findOne({id: req.body.otherUserId})
    if (!otherUser) {
        return res.status(404).send(
            {
                message: 'User not found',
                token: newToken
            }
        );
    }

    /* Check if the user is the same as the other user */
    if (req.body.userId === otherUser.id) {
        return res.status(400).send(
            {
                message: 'You cannot create a conversation with yourself',
                token: newToken
            }
        );
    }

    /* Check if the conversation already exists */
    let conversation = await Conversation.findOne({participants: [req.body.userId, otherUser.id]});
    if (conversation) {
        return res.status(400).send(
            {
                message: 'Conversation already exists',
                conversation: conversation,
                token: newToken
            }
        );
    }

    /* Create a new conversation */
    conversation = new Conversation({
        participants: [req.body.userId, otherUser.id]
    });
    await conversation.save();

    let {_id, __v, ...conversationWithoutId} = conversation.toObject();

    return res.status(201).send(
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
        return res.status(400).send(
            {
                message: 'Invalid request'
            }
        );
    }

    /* Check if the user is authenticated */
    let newToken = await authService.refreshToken(req.body.token, req.body.userId);
    if (!newToken) {
        return res.status(401).send(
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
        /* Only retrieve the last message */
        conversationWithoutId.messages = [conversationWithoutId.messages[conversationWithoutId.messages.length - 1]];
        return conversationWithoutId;
    });

    return res.status(200).send(
        {
            message: 'Conversations found',
            conversations: conversations,
            token: newToken
        }
    );
}

module.exports = {
    createConversation,
    getConversations
}