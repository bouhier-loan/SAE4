const User = require('../models/user');
const bcrypt = require('bcrypt');

/* Get user information
    * @param {Object} req - The request object
    * @param {String} req.body.userId - The user's id
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
    let users = await User.find({});

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
    * @param {String} req.body.token - The user's token
    * @param {String} req.params.id - The user's id
    * @param {String} req.body.displayName - The user's display name
    * @param {String} req.body.password - The user's password
    * @param {String} req.body.newPassword - The user's new password
    * @param {Object} res - The response object
    * @return {Object} - The response object

 */
async function updateUser(req, res) {
    /* Check if the request is valid */
    if (!req.body.token || !req.body.displayName || !req.body.password || !req.body.newPassword) {
        return res.status(400).json(
            {
                message: 'Invalid request'
            }
        );
    }

    /* Check if the user is authenticated */
    let newToken = await authService.refreshToken(req.body.token, req.params.id);
    if (!newToken) {
        return res.status(401).json(
            {
                message: 'Unauthorized'
            }
        );
    }

    /* Check if the user exists */
    let user = await User.findOne({id: req.params.id});
    if (!user) {
        return res.status(404).json(
            {
                message: 'User not found',
                token: newToken
            }
        );
    }

    /* Check if the password is correct */
    let validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
        return res.status(400).json(
            {
                message: 'Invalid credentials',
                token: newToken
            }
        );
    }

    /* Update the user's information */
    user.displayName = req.body.displayName;
    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();

    /* Remove sensitive information */
    const { password, _id, __v, ...userWithoutPassword } = user.toObject();

    /* Return the user's information */
    return res.status(200).json(
        {
            message: 'User information updated successfully',
            token: newToken,
            user: userWithoutPassword
        }
    );
}


module.exports = {
    getUserInfo,
    getAllUsers,
    updateUser
}