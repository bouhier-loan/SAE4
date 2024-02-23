const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const AccessToken = require('../models/AccessToken');

/* Register the user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The user if the registration is successful, otherwise an error message
 */
async function register(req, res) {
    /* Check if the user already exists */
    let isUser = await User.findOne({ username: req.body.username });
    if (isUser) {
        res.status(400).send(
            {message: 'User already exists'}
        );
    };

    /* Check if the password is valid */
    if (req.body.password.length < 8) {
        res.status(400).send(
            {message: 'Password must be at least 8 characters'}
        );
    };

    /* Check if the username is valid */
    if (req.body.username.length < 4 || req.body.username.length > 20) {
        res.status(400).send(
            {message: 'Username must be at least 4 characters and at most 20 characters'}
        );
    };

    /* Encrypt the password */
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);


    /* Create the user */
    const user = new User({
        username: req.body.username,
        password: hash
    });

    /* Save the user */
    const savedUser = await user.save();

    /* Send the user back */
    const { password, ...userWithoutPassword } = savedUser.toObject();
    res.status(201).send(userWithoutPassword);
};


/* Login the user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {String} - The token if the login is successful, otherwise an error message
 */
async function login(req, res) {
    /* Check if the user exists */
    const user = await User.findOne({username: req.body.username});
    if (!user) {
        res.status(400).send(
            {message: 'User does not exist'}
        );
    }
    ;

    /* Check if the password is correct */
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        res.status(400).send(
            {message: 'Invalid credentials'}
        );
    }
    ;

    /* Check if the user already has a token and delete it */
    let token = await AccessToken.findOne({userId: user._id});
    if (token) {
        await AccessToken.deleteOne({userId: user._id});
    }
    ;

    /* Create and assign a token */
    token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    const accessToken = new AccessToken({
        userId: user._id,
        token: token,
        expires: Date.now() + 3600000 // 1 hour
    });

    /* Save the token */
    const savedToken = await accessToken.save();

    /* Send the token back */
    res.status(200).send(token.token);
}

/*
 * Refresh the token
 * @param {Object} token - The token to refresh
 * @returns {String} - The new token or null if the token does not exist or is expired
 */
async function refreshToken(token) {
    /* Check if the token exists */
    const accessToken = await AccessToken.findOne({token: token.token, userId: token.userId});
    if (!accessToken) {
        return null;
    }

    /* Check if the token is expired */
    if (accessToken.expires < Date.now()) {
        await AccessToken.deleteOne({token: token.token, userId: token.userId});
        return null;
    }

    /* Create and assign a new token */
    const newToken = jwt.sign({_id: token.userId}, process.env.TOKEN_SECRET);
    accessToken.token = newToken;
    accessToken.expires = Date.now() + 3600000; // 1 hour

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