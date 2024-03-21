const { matchedData } = require('express-validator');
const axios = require('axios');

const USER_BASE_URL = process.env.API_URL + process.env.USER_SERVICE_PORT + '/users';

/* User login
    * @param {Object} req - request object
    * @param {String} req.body.username - username
    * @param {String} req.body.password - password
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function login(req, res) {
    const data = matchedData(req);

    let status = {
        user: null,
        token: null
    }

    let response;

    /* Get the user */
    response = await axios.get(USER_BASE_URL, {params: {username: data.username}})

    if (response.status !== 200) {
        return res.status(response.status).send(response.data);
    }
    if (response.data.users.length === 0) {
        return res.status(404).send({
            message: 'User not found'
        });
    }

    status.user = response.data.users[0];


    /* Check the user's password */
    response = await axios.post(USER_BASE_URL + `/${status.user.id}/password`, data)

    if (response.status !== 200) {
        return res.status(response.status).send(response.data);
    }

    /* Create a token */
    response = await axios.post(USER_BASE_URL + `/${status.user.id}/token`, data)

    if (response.status !== 200) {
        return res.status(response.status).send(response.data);
    }

    status.token = response.data.body.token;

    /* Return the user and token */
    return res.status(200).send(status);
}

/* User registration
    * @param {Object} req - request object
    * @param {String} req.body.username - username
    * @param {String} req.body.password - password
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function register(req, res) {
    const data = matchedData(req);

    const status = {
        user: null,
        token: null
    }

    let response;
    /* Create the user */
    response = await axios.post(USER_BASE_URL, data)

    if (response.status !== 201) {
        return res.status(response.status).send(response.data);
    }

    status.user = response.data.user;

    /* Create a token */
    response = await axios.post(USER_BASE_URL + `/${status.user.id}/token`)

    if (response.status !== 201) {
        return res.status(response.status).send(response.data);
    }

    status.token = response.data.body.token;

    /* Return the user and token */
    return res.status(201).send(status);
}

/* User update (Needs token)
    * @param {Object} req - request object
    * @param {String} req.params.id - user id
    * @param {String} req.body.displayName - display name
    * @param {String} req.body.password - password
    * @param {String} req.body.token - token
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function updateUser(req, res) {
    const data = matchedData(req);

    const status = {
        user: null,
        token: req.newToken
    }

    let response;
    /* Update the user */
    response = await axios.put(USER_BASE_URL + `/${req.params.id}`, data)

    if (response.status !== 200) {
        return res.status(response.status).send(response.data);
    }

    status.user = response.data.user;

    /* Return the updated user */
    return res.status(200).send(status);
}

/* User get all
    * @param {Object} req - request object
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function getAllUsers(req, res) {
    const status = {
        users: null
    }

    let response;
    /* Get all users */
    response = await axios.get(USER_BASE_URL, {params: {username: req.query.username}})

    if (response.status !== 200) {
        return res.status(response.status).send(response.data);
    }

    status.users = response.data.users;

    /* Return all users */
    return res.status(200).send(status);
}

module.exports = {
    login,
    register,
    updateUser,
    getAllUsers
};