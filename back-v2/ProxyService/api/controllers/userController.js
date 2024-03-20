const {matchedData} = require("express-validator");
const axios = require('axios');

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
    response = await axios.post(`http://localhost:${process.env.USER_SERVICE_PORT}/users/login`, data)

    if (response.status !== 200) {
        return res.status(response.status).send(response.data);
    }

    status.user = response.data.body;

    /* Check the user's password */
    response = await axios.post(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${status.user.id}/password`, data)

    if (response.status !== 200) {
        return res.status(response.status).send(response.data);
    }

    /* Create a token */
    response = await axios.post(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${status.user.id}/token`, data)

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
    * @param {String} req.body.displayName - display name (optional)
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function register(req, res) {
    /* Check if the request is valid */
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({
            message: 'Invalid request'
        });
    }

    /* Create the user */
    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    })
        .then(response => { return response.json() })
        .then(data => {
            return res.status(data.status).send(data.body);
        });
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
    /* Check if the request is valid */
    if (!req.body.displayName || !req.body.password || !req.body.token) {
        return res.status(400).send({
            message: 'Invalid request'
        });
    }

    /* Check if the token is valid */
    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${req.params.id}/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: req.body.token})
    })
        .then(response => { return response.json() })
        .then(data => {
            if (data.message === 'Invalid token') {
                return res.status(401).send({
                    message: 'Invalid token'
                });
            }

            /* Update the user */
            fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${req.params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({displayName: req.body.displayName, password: req.body.password})
            })
                .then(response => { return response.json() })
                .then(data => {
                    return res.status(data.status).send(data.body);
                })
                .catch(error => {
                    console.log(error);
                    return res.status(500).send({
                        message: 'Internal server error'
                    });
                });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({
                message: 'Internal server error'
            });
        });
}

/* User get
    * @param {Object} req - request object
    * @param {String} req.params.id - user id
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function getUser(req, res) {
    /* Get the user */
    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${req.params.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }})
        .then(response => { return response.json() })
        .then(data => {
            return res.status(data.status).send(data.body);
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({
                message: 'Internal server error'
            });
        });
}

/* User get all
    * @param {Object} req - request object
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function getAllUsers(req, res) {
    /* Get all users */
    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            return res.status(200).send(data);
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({
                message: 'Internal server error'
            });
        });
}

module.exports = {
    login,
    register,
    updateUser,
    getUser,
    getAllUsers
};