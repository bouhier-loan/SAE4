const { matchedData } = require('express-validator');
const axios = require('axios');

const CONVERSATION_BASE_URL = process.env.API_URL + process.env.CONVERSATION_SERVICE_PORT + '/conversations';


/* Conversation get all (Needs token)
    * @param {Object} req - request object
    * @param {String} req.headers.authorization - userId + token
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function getAllConversations(req, res) {
    const status = {
        conversations: [],
        token: req.newToken
    }

    let response;
    response = await axios.get(CONVERSATION_BASE_URL, {params: {userId: req.userId}})
    status.conversations = response.data.conversations;

    return res.status(200).json(status);
}

/* Conversation create
    * @param {Object} req - request object
    * @param {String} req.headers.authorization - userId + token
    * @param {Object} req.body - request body
    * @param {Array} req.body.participants - participants of the conversation
    * @param {String} req.body.name - name of the conversation
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function createConversation(req, res) {
    const data = matchedData(req);

    const status = {
        conversation: null
    }

    let response;
    response = await axios.post(CONVERSATION_BASE_URL, data)
    status.conversation = response.data;

    return res.status(200).json(status);
}

/* Conversation update (Needs token)
    * @param {Object} req - request object
    * @param {String} req.headers.authorization - userId + token
    * @param {Object} req.body - request body
    * @param {String} req.body.name - name of the conversation
    * @param {Object} req.params - request parameters
    * @param {String} req.params.id - conversation id
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function updateConversation(req, res) {
    const data = matchedData(req);

    const status = {
        conversation: null
    }

    let response;
    response = await axios.put(CONVERSATION_BASE_URL + '/' + req.params.id, data)
    status.conversation = response.data;

    return res.status(200).json(status);
}

/* Conversation delete (Needs token)
    * @param {Object} req - request object
    * @param {String} req.headers.authorization - userId + token
    * @param {Object} req.params - request parameters
    * @param {String} req.params.id - conversation id
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function deleteConversation(req, res) {
    const status = {
        conversation: null
    }

    let response;
    /* Check if user is the owner of the conversation */
    response = await axios.get(CONVERSATION_BASE_URL + '/' + req.params.id)
    if (response.data.owner !== req.userId) {
        return res.status(403).json({error: 'Forbidden'});
    }

    response = await axios.delete(CONVERSATION_BASE_URL + '/' + req.params.id)
    status.conversation = response.data;

    return res.status(200).json(status);
}

/* Conversation get messages (Needs token)
    * @param {Object} req - request object
    * @param {String} req.headers.authorization - userId + token
    * @param {Object} req.params - request parameters
    * @param {String} req.params.id - conversation id
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function getConversationMessages(req, res) {
    const status = {
        messages: [],
        token: req.newToken
    }

    let response;
    response = await axios.get(CONVERSATION_BASE_URL + '/' + req.params.id + '/messages')
    status.messages = response.data.messages;

    return res.status(200).json(status);
}

/* Conversation add participant (Needs token)
    * @param {Object} req - request object
    * @param {String} req.headers.authorization - userId + token
    * @param {Object} req.body - request body
    * @param {String} req.body.participantId - participant id
    * @param {Object} req.params - request parameters
    * @param {String} req.params.id - conversation id
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function addParticipant(req, res) {
    const data = matchedData(req);

    const status = {
        conversation: null
    }

    let response;
    response = await axios.post(CONVERSATION_BASE_URL + '/' + req.params.id + '/participants', data)
    status.conversation = response.data;

    return res.status(200).json(status);
}

/* Conversation remove participant (Needs token)
    * @param {Object} req - request object
    * @param {String} req.headers.authorization - userId + token
    * @param {Object} req.params - request parameters
    * @param {String} req.params.id - conversation id
    * @param {String} req.params.participant - participant id
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function removeParticipant(req, res) {
    const status = {
        conversation: null
    }

    let response;
    response = await axios.delete(CONVERSATION_BASE_URL + '/' + req.params.id + '/participants/' + req.params.participant)
    status.conversation = response.data;

    return res.status(200).json(status);
}

module.exports = {
    getAllConversations,
    createConversation,
    updateConversation,
    deleteConversation,
    getConversationMessages,
    addParticipant,
    removeParticipant
}