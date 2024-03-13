const User = require('../models/user');
const AccessToken = require('../models/accessToken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/* Shift the date by a number of seconds
 * @param {Number} seconds - The number of seconds to shift the date by
 * @returns {Date} - The shifted date
 */
Date.prototype.shift = function(seconds) {
    this.setTime(this.getTime() + (seconds*1000));
    return this;
}

/* Create a new user
 * @param {Object} req - The request object
 * @param {String} req.body.username - The user's username
 * @param {String} req.body.password - The user's password
 * @param {String} req.body.displayName - The user's display name (optional)
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
async function createUser(req, res) {
    /* Check if the request is valid */
    if (!req.body.username || !req.body.password) {
        console.log(req.body);
        return res.status(400).json(
            {message: 'Invalid request'}
        );
    }

    /* Check if the user already exists */
    let isUser = await User.findOne({ username: req.body.username });
    if (isUser) {
        return res.status(400).json(
            {message: 'User already exists'}
        );
    }

    /* Check if the password is valid */
    if (req.body.password.length < 8) {
        return res.status(400).json(
            {message: 'Password must be at least 8 characters'}
        );
    }

    /* Check if the username is valid */
    if (req.body.username.length < 4 || req.body.username.length > 20) {
        return res.status(400).json(
            {message: 'Username must be at least 4 characters and at most 20 characters'}
        );
    }

    /* Check if the display name is valid */
    if (req.body.displayName && (req.body.displayName.length < 4 || req.body.displayName.length > 20)) {
        return res.status(400).json(
            {message: 'Display name must be at least 4 characters and at most 20 characters'}
        );
    }

    /* Encrypt the password */
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);


    /* Create the user */
    const user = new User({
        id: uuidv4(),
        username: req.body.username,
        displayName: req.body.displayName || req.body.username,
        password: hash
    });

    /* Save the user */
    const savedUser = await user.save();

    /* Send the user back */
    const { password, _id, __v, ...userWithoutPassword } = savedUser.toJSON();
    return res.status(201).json(
        {
            message: 'User registered successfully',
            user: userWithoutPassword
        }
    );
}

/* Create a token for the user
 * @param {Object} req - The request object
 * @param {String} req.params.id - The user's id
 * @param {String} req.body.password - The user's password
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
async function createToken(req, res) {
    /* Check if the request is valid */
    if (!req.body.password) {
        return res.status(400).json(
            {message: 'Invalid request'}
        );
    }

    /* If the user already has a token, delete it */
    await AccessToken.deleteMany({userId:req.params.id});

    /* Create a new token */
    const token = uuidv4();
    const expires = new Date().shift(process.env.TOKEN_VALIDITY);

    /* Create the token */
    const accessToken = new AccessToken({
        token: token,
        userId: req.params.id,
        expires: expires
    });

    /* Save the token */
    await accessToken.save();

    /* Send the token back */
    return res.status(201).json(
        {
            message: 'Token created successfully',
            token: token
        }
    );
}

/* Check if the password is valid
    * @param {Object} req - The request object
    * @param {String} req.params.id - The user's id
    * @param {String} req.body.password - The user's password
    * @param {Object} res - The response object
    * @returns {Object} - The response object
 */
async function checkPassword(req, res) {
    /* Check if the password is correct */
    const user = await User.findOne({id: req.params.id});

    if (!user ) {
        return res.status(404).json(
            {message: 'User not found'}
        );
    }

    if (!(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(400).json(
            {message: 'Invalid password'}
        );
    }
    return res.status(200).json(
        {message: 'Password valid'}
    );
}

/* Check if the token is valid
 * @param {Object} req - The request object
 * @param {String} req.params.id - The user's id
 * @param {String} req.body.token - The token to check
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
async function checkToken(req, res) {
    /* Check if the request is valid */
    if (!req.body.token) {
        return res.status(400).json(
            {message: 'Invalid request'}
        );
    }
    

    /* Check if the token exists */
    const accessToken = await AccessToken.findOne({token: req.body.token, userId: req.params.id});
    if (!accessToken) {
        return res.status(400).json(
            {message: 'Invalid token'}
        );
    }

    /* Check if the token is expired */
    if (accessToken.expires < Date.now()) {
        await AccessToken.deleteOne({token: req.body.token, userId: req.params.id});
        return res.status(400).json(
            {message: 'Token expired'}
        );
    }

    await AccessToken.deleteMany({userId:req.params.id});

    /* Create a new token */
    const token = uuidv4();
    const expires = new Date().shift(process.env.TOKEN_VALIDITY);

    /* Create the token */
    const newAccessToken = new AccessToken({
        token: token,
        userId: req.params.id,
        expires: expires
    });

    /* Save the token */
    await newAccessToken.save();

    /* Send the response back */
    return res.status(200).json(
        {
            message: 'Token valid',
            newToken: token
        }
    );
}

/* Get user information
    * @param {Object} req - The request object
    * @param {String} req.params.id - The user's id
    * @param {Object} res - The response object
    * @return {Object} - The user's information
 */
async function getUserInfo(req, res) {
    /* Check if the user exists */
    let user = await User.findOne({
        id: req.params.id
    });
    if (!user) {
        return res.status(404).json(
            {
                message: 'User not found'
            }
        );
    }

    /* Return the user's information */
    return res.status(200).json(
        {
            message: 'User found',
            user: {
                id: user.id,
                username: user.username,
                displayName: user.displayName
            }
        }
    );
}

/* Get all users
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Object} - All users
 */
async function getAllUsers(req, res) {
    /* Get all users */
    console.log("HEYOOOO")
    let users;
    if (req.query.username) {
        users = await User.find({
            username: req.query.username
        });
    } else {
        users = await User.find({});
    }


    /* Remove sensitive information */
    users = users.map(user => {
        return {
            id: user.id,
            username: user.username,
            displayName: user.displayName
        }
    });

    /* Return all users */
    return res.status(200).json(
        {
            message: 'Users found',
            users: users
        }
    );
}

/* Update user information
    * @param {Object} req - The request object
    * @param {String} req.params.id - The user's id
    * @param {String} req.body.displayName - The user's display name
    * @param {String} req.body.password - The user's new password
    * @param {Object} res - The response object
    * @return {Object} - The response object

 */
async function updateUser(req, res) {
    /* Check if the request is valid */
    if (!req.body.displayName || !req.body.password) {
        return res.status(400).json(
            {
                message: 'Invalid request'
            }
        );
    }

    /* Check if the user exists */
    let user = await User.findOne({id: req.params.id});
    if (!user) {
        return res.status(404).json(
            {
                message: 'User not found',
            }
        );
    }

    /* Update the user's information */
    user.displayName = req.body.displayName;
    user.password = await bcrypt.hash(req.body.password, 10);
    await user.save();

    /* Remove sensitive information */
    const { password, _id, __v, ...userWithoutPassword } = user.toJSON();

    /* Return the user's information */
    return res.status(200).json(
        {
            message: 'User information updated successfully',
            user: userWithoutPassword
        }
    );
}


module.exports = {
    getUserInfo,
    getAllUsers,
    updateUser,
    createUser,
    createToken,
    checkToken,
    checkPassword
}