const { matchedData } = require('express-validator');
const axios = require('axios');
const dotenv = require('dotenv')

dotenv.config()

const CONVERSATION_BASE_URL = process.env.API_URL + process.env.CONVERSATION_SERVICE_PORT + '/messages';

/* /Messages */

/* Message create (needs token)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Response object
 */
async function sendMessage(req, res) {
    const data = matchedData(req);
    data.userId = req.userId;

    const status = {
        token: req.newToken
    }

    let response;
    response = await axios.post(CONVERSATION_BASE_URL, data)
    if (response.status !== 200) {
        return res.status(response.status).json(response.data)
    }

    return res.status(200).json(status);
}

/* Message edit (needs token)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Response object
 */
async function editMessage(req, res) {
    const data = matchedData(req);

    let response;
    response = await axios.put(CONVERSATION_BASE_URL + '/' + req.params.id, data)

    return res.status(response.status).json(response.data);
}

/* Message delete (needs token)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Response object
 */
async function deleteMessage(req, res) {
    let response;
    response = await axios.delete(CONVERSATION_BASE_URL + '/' + req.params.id)

    return res.status(response.status).json(response.data);
}

module.exports = {
    sendMessage,
    editMessage,
    deleteMessage
}