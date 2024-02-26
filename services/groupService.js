const Group = require('../models/group');
const User = require('../models/user');
const Message = require('../models/message');
const authService = require('./authService');

const { v4: uuidv4 } = require('uuid');


/* Create a new group
 * @param {Object} req - The request object
 * @param {String} req.body.name - The name of the group
 * @param {String} req.body.userId - The id of the user creating the group
 * @param {Array} req.body.participants - The users to add to the group
 * @param {String} req.body.token - The token of the user creating the group
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
async function createGroup(req, res) {
    /* Check if the request is valid */
    if (!req.body.name || !req.body.userId || !req.body.participants || !req.body.token) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    /* Check if the user is authenticated */
    const newToken = await authService.refreshToken(req.body.token, req.body.userId);
    if (!newToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    /* Check if the user exists */
    const user = await User.findOne({ id: req.body.userId });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    /* Check if the participants exist */
    const participants = await User.find({ id: { $in: req.body.participants } });
    if (participants.length !== req.body.participants.length) {
        return res.status(404).json({ message: 'Participants not found' });
    }

    /* Create the group */
    const group = new Group({
        id: uuidv4(),
        ownerId: req.body.userId,
        participants: req.body.participants,
        name: req.body.name
    });

    try {
        await group.save();

        /* Remove the _id and __v fields */
        let { _id, __v, ...groupData } = group.toObject();

        return res.status(201).json({ message: 'Group created', group: groupData, token: newToken });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {

}