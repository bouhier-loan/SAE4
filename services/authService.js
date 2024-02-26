const bcrypt = require('bcryptjs');
const {v4: uuidv4} = require('uuid');

const User = require('../models/user');
const AccessToken = require('../models/accessToken');

/* Shift the date by a number of seconds
 * @param {Number} seconds - The number of seconds to shift the date by
 * @returns {Date} - The shifted date
 */
Date.prototype.shift = function(seconds) {
    this.setTime(this.getTime() + (seconds*1000));
    return this;
}

/* Register the user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
async function register(req, res) {
    /* Check if the request is valid */
    if (!req.body.username || !req.body.password) {
        console.log(req.body);
        return res.status(400).send(
            {message: 'Invalid request'}
        );
    };

    /* Check if the user already exists */
    let isUser = await User.findOne({ username: req.body.username });
    if (isUser) {
        return res.status(400).send(
            {message: 'User already exists'}
        );
    };

    /* Check if the password is valid */
    if (req.body.password.length < 8) {
        return res.status(400).send(
            {message: 'Password must be at least 8 characters'}
        );
    };

    /* Check if the username is valid */
    if (req.body.username.length < 4 || req.body.username.length > 20) {
        return res.status(400).send(
            {message: 'Username must be at least 4 characters and at most 20 characters'}
        );
    };

    /* Encrypt the password */
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);


    /* Create the user */
    const user = new User({
        id: uuidv4(),
        username: req.body.username,
        password: hash
    });

    /* Save the user */
    const savedUser = await user.save();

    /* Send the user back */
    const { password, _id, __v, ...userWithoutPassword } = savedUser.toObject();
    return res.status(201).send(
        {
            message: 'User registered successfully',
            user: userWithoutPassword
        }
    );
};


/* Login the user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
async function login(req, res) {
    /* Check if the request is valid */
    if (!req.body.username || !req.body.password) {
        return res.status(400).send(
            {message: 'Invalid request'}
        );
    };

    /* Check if the user exists */
    const user = await User.findOne({username: req.body.username});
    if (!user) {
        return res.status(400).send(
            {message: 'User does not exist'}
        );
    };

    /* Check if the password is correct */
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send(
            {message: 'Invalid credentials'}
        );
    };

    /* Check if the user already has a token and delete it */
    let token = await AccessToken.findOne({userId: user.id});
    if (token) {
        await AccessToken.deleteOne({userId: user.id});
    };

    /* Create and assign a token */
    token = uuidv4();
    const accessToken = new AccessToken({
        userId: user.id,
        token: token,
        expires: new Date().shift(process.env.TOKEN_VALIDITY)
    });

    /* Save the token */
    const savedToken = await accessToken.save();

    /* Send the token back */
    return res.status(200).send(
        {
            message: 'Login successful',
            token: token
        }
    );
}

/* Refresh the token
 * @param {String} token - The token to refresh
 * @param {String} userId - The user id
 * @returns {String} - The new token or null if the token does not exist or is expired
 */
async function refreshToken(token, userId) {
    /* Check if the token exists */
    const accessToken = await AccessToken.findOne({token: token, userId: userId});
    if (!accessToken) {
        return null;
    }

    /* Check if the token is expired */
    if (accessToken.expires < Date.now()) {
        await AccessToken.deleteOne({token: token, userId: userId});
        return null;
    }

    /* Create and assign a new token */
    const newToken = uuidv4();
    accessToken.token = newToken;
    accessToken.expires = new Date().shift(process.env.TOKEN_VALIDITY)

    /* Save the token */
    const savedToken = await accessToken.save();

    /* Send the token back */
    return newToken;
}


module.exports = {
    register,
    login,
    refreshToken
};