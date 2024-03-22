const User = require('../models/user');
const AccessToken = require('../models/accessToken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const {matchedData} = require("express-validator");
const dateShift = require('../../tools/dateShift');

/* Valid colors for users */
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

/* Create a new user
 * @param {Object} req - The request object
 * @param {String} req.body.username - The user's username
 * @param {String} req.body.password - The user's password
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
async function createUser(req, res) {
    const data = matchedData(req)
    /* Check if the user already exists */
    let isUser = await User.findOne({ username: data.username });
    if (isUser) {
        return res.status(400).json({
            message: 'User already exists'
        });
    }

    /* Encrypt the password */
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);


    /* Create the user */
    const user = new User({
        id: uuidv4(),
        username: req.body.username,
        displayName: req.body.displayName || req.body.username,
        password: hash,
        color: colors[Math.floor(Math.random() * colors.length)]
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
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
async function createToken(req, res) {
    /* If the user already has a token, delete it */
    await AccessToken.deleteMany({userId:req.params.id});

    /* Create a new token */
    const token = uuidv4();
    const expires = dateShift(new Date(),process.env.TOKEN_VALIDITY);

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
    const data = matchedData(req)

    /* Check if the password is correct */
    const user = await User.findOne({id: req.params.id});

    if (!user ) {
        return res.status(404).json(
            {message: 'User not found'}
        );
    }

    if (!(await bcrypt.compare(data.password, user.password))) {
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
    const data = matchedData(req)
    console.log('----')
    console.log('Token: ' + data.token)
    console.log('User id: ' + req.params.id)

    /* Check if the token exists */
    const accessToken = await AccessToken.findOne({token: data.token, userId: req.params.id});
    if (!accessToken) {
        return res.status(401).json(
            {message: 'Invalid token'}
        );
    }
    console.log('Access token' + accessToken)

    /* Check if the token is expired */
    if (accessToken.expires < Date.now()) {
        await AccessToken.deleteOne({token: data.token, userId: req.params.id});
        console.log('Token expired')
        return res.status(401).json(
            {message: 'Token expired'}
        );
    }

    await AccessToken.deleteMany({userId:req.params.id});

    /* Create a new token */
    const token = uuidv4();
    const expires = dateShift(new Date(),process.env.TOKEN_VALIDITY);

    /* Create the token */
    const newAccessToken = new AccessToken({
        token: token,
        userId: req.params.id,
        expires: expires
    });
    console.log('New access token' + newAccessToken)

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

/* Get all users
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Object} - All users
 */
async function getAllUsers(req, res) {
    /* Get all users */
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
            displayName: user.displayName,
            color: user.color
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
    const data = matchedData(req)

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
    user.displayName = data.displayName;
    user.password = await bcrypt.hash(data.password, 10);
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
    getAllUsers,
    updateUser,
    createUser,
    createToken,
    checkToken,
    checkPassword
}