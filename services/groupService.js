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
        return res.status(400).json({
            message: 'Invalid request'
        });
    }

    /* Check if the user is authenticated */
    const newToken = await authService.refreshToken(req.body.token, req.body.userId);
    if (!newToken) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    /* Check if the user exists */
    const user = await User.findOne({ id: req.body.userId });
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    /* Check if the participants exist */
    const participants = await User.find({ id: { $in: req.body.participants } });
    if (participants.length !== req.body.participants.length) {
        return res.status(404).json({
            message: 'Participants not found'
        });
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

        return res.status(201).json({
            message: 'Group created',
            group: groupData,
            token: newToken
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

/* Get all the groups of a user
 * @param {Object} req - The request object
 * @param {String} req.body.userId - The id of the user
 * @param {String} req.body.token - The token of the user
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
async function getGroups(req, res) {
    /* Check if the request is valid */
    if (!req.body.userId || !req.body.token) {
        return res.status(400).json({
            message: 'Invalid request'
        });
    }

    /* Check if the user is authenticated */
    const newToken = await authService.refreshToken(req.body.token, req.body.userId);
    if (!newToken) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    /* Check if the user exists */
    const user = await User.findOne({ id: req.body.userId });
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    /* Get the groups */
    const groups = await Group.find({ participants: req.body.userId });

    /* Remove the _id and __v fields */
    groups.map(group => {
        let { _id, __v, ...groupData } = group.toObject();
        return groupData;
    });

    return res.status(200).json({
        message: 'Groups found',
        groups: groups,
        token: newToken
    });
}

/* Get a group by its id
 * @param {Object} req - The request object
 * @param {String} req.body.groupId - The id of the group
 * @param {String} req.body.userId - The id of the user
 * @param {String} req.body.token - The token of the user
 * @param {Object} res - The response object
 */
async function getGroupById(req, res) {
    /* Check if the request is valid */
    if (!req.body.groupId || !req.body.userId || !req.body.token) {
        return res.status(400).json({
            message: 'Invalid request'
        });
    }

    /* Check if the user is authenticated */
    const newToken = await authService.refreshToken(req.body.token, req.body.userId);
    if (!newToken) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    /* Check if the user exists */
    let user = await User.findOne({ id: req.body.userId });
    if (!user) {
        return res.status(404).json({
            message: 'User not found',
            token: newToken
        });
    }

    /* Check if the group exists */
    let group = await Group.findOne({ id: req.body.groupId });
    if (!group) {
        return res.status(404).json({
            message: 'Group not found',
            token: newToken
        });
    }

    /* Check if the user is part of the group */
    if (!group.participants.includes(req.body.userId)) {
        return res.status(403).json({
            message: 'Forbidden',
            token: newToken
        });
    }

    /* Remove the _id and __v fields */
    let { _id, __v, ...groupData } = group.toObject();

    return res.status(200).json({
        message: 'Group found',
        group: groupData,
        token: newToken
    });
}


/* Get the messages of a group
 * @param {Object} req - The request object
 * @param {String} req.body.groupId - The id of the group
 * @param {String} req.body.userId - The id of the user
 * @param {String} req.body.token - The token of the user
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
async function getGroupMessages(req, res) {
    /* Check if the request is valid */
    if (!req.body.groupId || !req.body.userId || !req.body.token) {
        return res.status(400).json({
            message: 'Invalid request'
        });
    }

    /* Check if the user is authenticated */
    const newToken = await authService.refreshToken(req.body.token, req.body.userId);
    if (!newToken) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    /* Check if the user exists */
    let user = await User.findOne({ id: req.body.userId });
    if (!user) {
        return res.status(404).json({
            message: 'User not found',
            token: newToken
        });
    }

    /* Check if the group exists */
    let group = await Group.findOne({ id: req.body.groupId });
    if (!group) {
        return res.status(404).json({
            message: 'Group not found',
            token: newToken
        });
    }

    /* Check if the user is part of the group */
    if (!group.participants.includes(req.body.userId)) {
        return res.status(403).json({
            message: 'Forbidden',
            token: newToken
        });
    }

    /* Get the messages */
    let messages = await Message.find({ groupId: req.body.groupId });

    /* Remove the _id and __v fields */
    messages.map(message => {
        let { _id, __v, ...messageData } = message.toObject();
        return messageData;
    });

    return res.status(200).json({
        message: 'Messages found',
        messages: messages,
        token: newToken
    });
}

/* Add a user to a group
 * @param {Object} req - The request object
 * @param {String} req.body.groupId - The id of the group
 * @param {String} req.body.userId - The id of the user
 * @param {String} req.body.participantId - The id of the user to add to the group
 * @param {String} req.body.token - The token of the user
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
async function addParticipant(req, res) {
    /* Check if the request is valid */
    if (!req.body.groupId || !req.body.userId || !req.body.participantId || !req.body.token) {
        return res.status(400).json({
            message: 'Invalid request'
        });
    }

    /* Check if the user is authenticated */
    const newToken = await authService.refreshToken(req.body.token, req.body.userId);
    if (!newToken) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    /* Check if the user exists */
    let user = await User.findOne({ id: req.body.userId });
    if (!user) {
        return res.status(404).json({
            message: 'User not found',
            token: newToken
        });
    }

    /* Check if the participant exists */
    let participant = await User.findOne({ id: req.body.participantId });
    if (!participant) {
        return res.status(404).json({
            message: 'Participant not found',
            token: newToken
        });
    }

    /* Check if the group exists */
    let group = await Group.findOne({ id: req.body.groupId });
    if (!group) {
        return res.status(404).json({
            message: 'Group not found',
            token: newToken
        });
    }

    /* Check if the user is the owner of the group */
    if (group.ownerId !== req.body.userId) {
        return res.status(403).json({
            message: 'Forbidden',
            token: newToken
        });
    }

    /* Add the participant to the group */
    group.participants.push(req.body.participantId);
    try {
        await group.save();

        /* Remove the _id and __v fields */
        let { _id, __v, ...groupData } = group.toObject();

        return res.status(200).json({
            message: 'Participant added',
            group: groupData,
            token: newToken
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

/* Remove a user from a group
 * @param {Object} req - The request object
 * @param {String} req.body.groupId - The id of the group
 * @param {String} req.body.userId - The id of the user
 * @param {String} req.body.participantId - The id of the user to remove from the group
 * @param {String} req.body.token - The token of the user
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
async function removeParticipant(req, res) {
    /* Check if the request is valid */
    if (!req.body.groupId || !req.body.userId || !req.body.participantId || !req.body.token) {
        return res.status(400).json({
            message: 'Invalid request'
        });
    }

    /* Check if the user is authenticated */
    const newToken = await authService.refreshToken(req.body.token, req.body.userId);
    if (!newToken) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    /* Check if the user exists */
    let user = await User.findOne({ id: req.body.userId });
    if (!user) {
        return res.status(404).json({
            message: 'User not found',
            token: newToken
        });
    }

    /* Check if the participant exists */
    let participant = await User.findOne({ id: req.body.participantId });
    if (!participant) {
        return res.status(404).json({
            message: 'Participant not found',
            token: newToken
        });
    }

    /* Check if the group exists */
    let group = await Group.findOne({ id: req.body.groupId });
    if (!group) {
        return res.status(404).json({
            message: 'Group not found',
            token: newToken
        });
    }

    /* Check if the user is the owner of the group */
    if (group.ownerId !== req.body.userId) {
        return res.status(403).json({
            message: 'Forbidden',
            token: newToken
        });
    }

    /* Remove the participant from the group */
    group.participants = group.participants.filter(participant => participant !== req.body.participantId);
    try {
        await group.save();

        /* Remove the _id and __v fields */
        let { _id, __v, ...groupData } = group.toObject();

        return res.status(200).json({
            message: 'Participant removed',
            group: groupData,
            token: newToken
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

/* Delete a group
 * @param {Object} req - The request object
 * @param {String} req.body.groupId - The id of the group
 * @param {String} req.body.userId - The id of the user
 * @param {String} req.body.token - The token of the user
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
async function deleteGroup(req, res) {
    /* Check if the request is valid */
    if (!req.body.groupId || !req.body.userId || !req.body.token) {
        return res.status(400).json({
            message: 'Invalid request'
        });
    }

    /* Check if the user is authenticated */
    const newToken = await authService.refreshToken(req.body.token, req.body.userId);
    if (!newToken) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    /* Check if the user exists */
    let user = await User.findOne({ id: req.body.userId });
    if (!user) {
        return res.status(404).json({
            message: 'User not found',
            token: newToken
        });
    }

    /* Check if the group exists */
    let group = await Group.findOne({ id: req.body.groupId });
    if (!group) {
        return res.status(404).json({
            message: 'Group not found',
            token: newToken
        });
    }

    /* Check if the user is the owner of the group */
    if (group.ownerId !== req.body.userId) {
        return res.status(403).json({
            message: 'Forbidden',
            token: newToken
        });
    }

    /* Delete the group */
    try {
        await group.delete();

        /* Delete the messages of the group */
        await Message.deleteMany({ conversationId: req.body.groupId });


        return res.status(200).json({
            message: 'Group deleted',
            token: newToken
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

/* Rename a group
 * @param {Object} req - The request object
 * @param {String} req.body.groupId - The id of the group
 * @param {String} req.body.userId - The id of the user
 * @param {String} req.body.name - The new name of the group
 * @param {String} req.body.token - The token of the user
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
async function renameGroup(req, res) {
/* Check if the request is valid */
    if (!req.body.groupId || !req.body.userId || !req.body.name || !req.body.token) {
        return res.status(400).json({
            message: 'Invalid request'
        });
    }

    /* Check if the user is authenticated */
    const newToken = await authService.refreshToken(req.body.token, req.body.userId);
    if (!newToken) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    /* Check if the user exists */
    let user = await User.findOne({ id: req.body.userId });
    if (!user) {
        return res.status(404).json({
            message: 'User not found',
            token: newToken
        });
    }

    /* Check if the group exists */
    let group = await Group.findOne({ id: req.body.groupId });
    if (!group) {
        return res.status(404).json({
            message: 'Group not found',
            token: newToken
        });
    }

    /* Check if the user is the owner of the group */
    if (group.ownerId !== req.body.userId) {
        return res.status(403).json({
            message: 'Forbidden',
            token: newToken
        });
    }

    /* Rename the group */
    group.name = req.body.name;
    try {
        await group.save();

        /* Remove the _id and __v fields */
        let { _id, __v, ...groupData } = group.toObject();

        return res.status(200).json({
            message: 'Group renamed',
            group: groupData,
            token: newToken
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

/* Get all the participants of a group
 * @param {Object} req - The request object
 * @param {String} req.body.groupId - The id of the group
 * @param {String} req.body.userId - The id of the user
 * @param {String} req.body.token - The token of the user
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
async function getGroupParticipants(req, res) {
    /* Check if the request is valid */
    if (!req.body.groupId || !req.body.userId || !req.body.token) {
        return res.status(400).json({
            message: 'Invalid request'
        });
    }

    /* Check if the user is authenticated */
    const newToken = await authService.refreshToken(req.body.token, req.body.userId);
    if (!newToken) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    /* Check if the user exists */
    let user = await User.findOne({id: req.body.userId});
    if (!user) {
        return res.status(404).json({
            message: 'User not found',
            token: newToken
        });
    }

    /* Check if the group exists */
    let group = await Group.findOne({id: req.body.groupId});
    if (!group) {
        return res.status(404).json({
            message: 'Group not found',
            token: newToken
        });
    }

    /* Check if the user is part of the group */
    if (!group.participants.includes(req.body.userId)) {
        return res.status(403).json({
            message: 'Forbidden',
            token: newToken
        });
    }

    /* Get the participants */
    let participants = await User.find({id: {$in: group.participants}});

    /* Remove the _id and __v fields */
    participants.map(participant => {
        let {_id, __v, ...participantData} = participant.toObject();
        return participantData;
    });

    return res.status(200).json({
        message: 'Participants found',
        participants: participants,
        token: newToken
    });
}

module.exports = {
    createGroup,
    getGroups,
    getGroupById,
    getGroupMessages,
    addParticipant,
    removeParticipant,
    deleteGroup,
    renameGroup,
    getGroupParticipants
}