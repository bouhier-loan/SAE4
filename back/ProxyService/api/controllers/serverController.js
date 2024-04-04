const {matchedData} = require('express-validator');
const axios = require('axios');
const dotenv = require('dotenv')

dotenv.config()

const MESSAGE_BASE_URL = process.env.API_URL + process.env.CONVERSATION_SERVICE_PORT + '/messages';
const CONVERSATION_BASE_URL = process.env.API_URL + process.env.CONVERSATION_SERVICE_PORT + '/conversations';
const USER_BASE_URL = process.env.API_URL + process.env.USER_SERVICE_PORT + '/users';
const PROJECT_BASE_URL = process.env.API_URL + process.env.PROJECT_SERVICE_PORT + '/projects';

/* Fetch server status */
async function fetchServerStatus(req, res) {
    const data = matchedData(req);

    const status = {
        conversations: [],
        projects: [],
        users: [],
    }

    const userData = {
        id: req.userId,
        token: req.token,
        conversations: [],
        projects: []
    }
    let response;

    /* Fetch user data */
    /* Fetch user conversations */
    response = await axios.get(CONVERSATION_BASE_URL, {params: {userId: userData.id}})
    userData.conversations = response.data.conversations;
    response.data.conversations.forEach(conversation => {
        conversation.messages = []
        status.conversations.push(conversation)
    });

    /* Fetch user projects */
    /*response = await axios.get(PROJECT_BASE_URL, {params: {userId: userData.id}})
    userData.projects = response.data.projects;
    response.data.projects.forEach(project => {
        project.tasks = []
        status.projects.push(project)
    });

    /* Fetch server status */
    if (data.fetch) {
        for (const conversation of userData.conversations) {
            /* Fetch all unread messages */
            response = await axios.get(CONVERSATION_BASE_URL + '/' + conversation.id + '/messages/fetch/' + req.userId)
            status.conversations.find(c => c.id === conversation.id).messages = response.data.messages;
        }

        //TODO: Fetch all tasks
    } else {
        for (const conversation of userData.conversations) {
            /* Fetch all messages */
            response = await axios.get(CONVERSATION_BASE_URL + '/' + conversation.id + '/messages', {params: {userId: req.userId}})
            status.conversations.find(c => c.id === conversation.id).messages = response.data.messages;
        }

        //TODO: Fetch all tasks
    }

    /* Fetch all users */
    response = await axios.get(USER_BASE_URL)
    status.users = response.data.users;

    return res.status(200).json(status);
}

module.exports = {
    fetchServerStatus
}