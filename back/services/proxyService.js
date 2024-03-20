/* Conversation */

/* Conversation get all (Needs token)
    * @param {Object} req - request object
    * @param {String} req.headers.authorization - userId + token
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function getAllConversations(req, res) {
    /* Check if the request is valid */
    if (!req.headers.authorization) {
        return res.status(400).send({
            message: 'Invalid request'
        });
    }

    let tmp = req.headers.authorization.split(' ');
    let userId = tmp[0];
    let token = tmp[1];

    /* Check if the token is valid */
    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${userId}/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: token})
    })
        .then(response => { return response.json() })
        .then(data => {
            if (data.message === 'Invalid token') {
                return res.status(401).send({
                    message: 'Invalid token'
                });
            }

            /* Get all conversations */
            fetch(`http://localhost:${process.env.MESSAGE_SERVICE_PORT}/conversations?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {return response.json() })
                .then(data => {
                    return res.status(200).send(data);
                })
        })
}

/* Conversation get (Needs token)
    * @param {Object} req - request object
    * @param {String} req.params.id - conversation id
    * @param {String} req.body.userId - user id
    * @param {String} req.body.token - token
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function getConversation(req, res) {
    /* Check if the request is valid */
    if (!req.body.userId || !req.body.token) {
        return res.status(400).send({
            message: 'Invalid request'
        });
    }

    /* Check if the token is valid */
    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${req.body.userId}/token`, {
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

            /* Get the conversation */
            fetch(`http://localhost:${process.env.MESSAGE_SERVICE_PORT}/conversations/${req.params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
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

/* Conversation get messages (Needs token)
    * @param {Object} req - request object
    * @param {String} req.params.id - conversation id
    * @param {String} req.headers.authorization - userId + token
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function getConversationMessages(req, res) {
    /* Check if the request is valid */
    if (!req.headers.authorization) {
        return res.status(400).send({
            message: 'Invalid request'
        });
    }

    let {userId, token} = req.headers.authorization.split(' ');


    /* Check if the token is valid */
    let newToken;
    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${userId}/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: token})
    })
        .then(response => { return response.json() })
        .then(data => {
            if (data.message === 'Invalid token') {
                return res.status(401).send({
                    message: 'Invalid token'
                });
            }
            newToken = data.newToken;
        })
        .catch(error => {
            console.log(error);
            return res.status(503).send({
                message: 'Internal server error'
            });
        });

    /* Get the messages */
    fetch(`http://localhost:${process.env.MESSAGE_SERVICE_PORT}/conversations/${req.params.id}/messages`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => { return response.json() })
        .then(data => {
            return res.status(200).json({
                messages: data.messages,
                token: newToken
            });
        })
}

/* Conversation create (Needs token)
    * @param {Object} req - request object
    * @param {String} req.body.userId - user id
    * @param {String} req.body.token - token
    * @param {Array} req.body.participants - participants
    * @param {String} req.body.name - name
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function createConversation(req, res) {
    /* Check if the request is valid */
    if (!req.body.userId || !req.body.token || !req.body.participants || !req.body.name) {
        return res.status(400).send({
            message: 'Invalid request'
        });
    }

    /* Check if the token is valid */
    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${req.body.userId}/token`, {
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

            /* Add the user to the participants */
            req.body.participants.push(req.body.userId);

            /* Create the conversation */
            fetch(`http://localhost:${process.env.MESSAGE_SERVICE_PORT}/conversations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({participants: req.body.participants, name: req.body.name, ownerId: req.body.userId})
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

/* Conversation delete (Needs token)
    * @param {Object} req - request object
    * @param {String} req.params.id - conversation id
    * @param {String} req.body.userId - user id
    * @param {String} req.body.token - token
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function deleteConversation(req, res) {
    /* Check if the request is valid */
    if (!req.body.userId || !req.body.token) {
        return res.status(400).send({
            message: 'Invalid request'
        });
    }

    /* Check if the token is valid */
    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${req.body.userId}/token`, {
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

            /* Check if the user is the owner of the conversation */
            fetch(`http://localhost:${process.env.MESSAGE_SERVICE_PORT}/conversations/${req.params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => { return response.json() })
                .then(data => {
                    if (data.body.ownerId !== req.body.userId) {
                        return res.status(403).send({
                            message: 'Forbidden'
                        });
                    }

                    /* Delete the conversation */
                    fetch(`http://localhost:${process.env.MESSAGE_SERVICE_PORT}/conversations/${req.params.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
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
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({
                message: 'Internal server error'
            });
        });
}

/* Conversation update (Needs token)
    * @param {Object} req - request object
    * @param {String} req.params.id - conversation id
    * @param {String} req.body.userId - user id
    * @param {String} req.body.token - token
    * @param {String} req.body.name - name
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function updateConversation(req, res) {
    /* Check if the request is valid */
    if (!req.body.userId || !req.body.token || !req.body.name) {
        return res.status(400).send({
            message: 'Invalid request'
        });
    }

    /* Check if the token is valid */
    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${req.body.userId}/token`, {
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

            /* Check if the user is the owner of the conversation */
            fetch(`http://localhost:${process.env.MESSAGE_SERVICE_PORT}/conversations/${req.params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => { return response.json() })
                .then(data => {
                    if (data.body.ownerId !== req.body.userId) {
                        return res.status(403).send({
                            message: 'Forbidden'
                        });
                    }

                    /* Update the conversation */
                    fetch(`http://localhost:${process.env.MESSAGE_SERVICE_PORT}/conversations/${req.params.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({name: req.body.name})
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
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({
                message: 'Internal server error'
            });
        });
}

/* Conversation add participant (Needs token)
    * @param {Object} req - request object
    * @param {String} req.params.id - conversation id
    * @param {String} req.headers.authorization - userId + token
    * @param {String} req.body.participantId - participant id
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function addParticipant(req, res) {
    /* Check if the request is valid */
    if (!req.body.participantId) {
        return res.status(400).send({
            message: 'Invalid request'
        });
    }

    let tmp = req.headers.authorization.split(' ');
    let userId = tmp[0];
    let token = tmp[1];

    let newToken;

    /* Check if the token is valid */
    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${userId}/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: token})
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.message === 'Invalid token') {
                return res.status(401).send({
                    message: 'Invalid token'
                });
            }

            newToken = data.newToken;
        });

    /* Check if the user is the owner of the conversation */
    fetch(`http://localhost:${process.env.MESSAGE_SERVICE_PORT}/conversations/${req.params.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {return response.json()})
        .then(data => {
            if (data.ownerId !== userId) {
                return res.status(403).send({
                    message: 'Forbidden',
                    token: newToken
                });
            }
        })

    /* Add the participant */
    fetch(`http://localhost:${process.env.MESSAGE_SERVICE_PORT}/conversations/${req.params.id}/participants`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({participantId: req.body.participantId})
    })
        .then(response => { return response.json() })
        .then(data => {
            return res.status(200).send(
                {
                    message: 'Participant added',
                    token: newToken
                }
            );
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({
                message: 'Internal server error',
                token: newToken
            });
        });

}

/* Conversation remove participant (Needs token)
    * @param {Object} req - request object
    * @param {String} req.params.id - conversation id
    * @param {String} req.body.userId - user id
    * @param {String} req.body.token - token
    * @param {String} req.body.participantId - participant id
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function removeParticipant(req, res) {
    /* Check if the request is valid */
    if (!req.body.userId || !req.body.token || !req.body.participantId) {
        return res.status(400).send({
            message: 'Invalid request'
        });
    }

    /* Check if the token is valid */
    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${req.body.userId}/token`, {
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

            /* Check if the user is the owner of the conversation */
            fetch(`http://localhost:${process.env.MESSAGE_SERVICE_PORT}/conversations/${req.params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => { return response.json() })
                .then(data => {
                    if (data.body.ownerId !== req.body.userId) {
                        return res.status(403).send({
                            message: 'Forbidden'
                        });
                    }

                    /* Remove the participant */
                    fetch(`http://localhost:${process.env.MESSAGE_SERVICE_PORT}/conversations/${req.params.id}/participants/${req.body.participantId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
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
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({
                message: 'Internal server error'
            });
        });
}

/* Conversation get participants (Needs token)
    * @param {Object} req - request object
    * @param {String} req.params.id - conversation id
    * @param {String} req.body.userId - user id
    * @param {String} req.body.token - token
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function getParticipants(req, res) {
    /* Check if the request is valid */
    if (!req.body.userId || !req.body.token) {
        return res.status(400).send({
            message: 'Invalid request'
        });
    }

    /* Check if the token is valid */
    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${req.body.userId}/token`, {
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

            /* Get the participants */
            fetch(`http://localhost:${process.env.MESSAGE_SERVICE_PORT}/conversations/${req.params.id}/participants`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
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


/* Message */

/* Message send (Needs token)
    * @param {Object} req - request object
    * @param {String} req.headers.authorization - userId + token
    * @param {String} req.body.conversationId - conversation id
    * @param {Object} req.body.content - content
    * @param {String} req.body.content.message - message
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function createMessage(req, res) {
    /* Check if the request is valid */
    if (!req.body.conversationId || !req.body.content || !req.body.content.message) {
        return res.status(400).json({
            message: 'Invalid request'
        });
    }

    let tmp = req.headers.authorization.split(' ');
    let userId = tmp[0];
    let token = tmp[1];

    /* Check if the token is valid */
    let newToken;
    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${userId}/token/check`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: token})
    })
        .then(response => { return response.json() })
        .then(data => {
            if (data.message === 'Invalid token') {
                return res.status(401).json({
                    message: 'Invalid token'
                });
            }
            newToken = data.newToken;
    });

    /* Send the message */
    fetch(`http://localhost:${process.env.MESSAGE_SERVICE_PORT}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId: userId, content: req.body.content, conversationId: req.body.conversationId})
    })
        .then(response => { return response.json() })
        .then(data => {
            if (data.message === 'Message created') {
                return res.status(200).json({
                    message: 'Message created',
                    token: newToken
                });
            }
            if (data.message === 'Conversation not found') {
                return res.status(404).json({
                    message: 'Conversation not found',
                    token: newToken
                });
            }
            if (data.message === 'The user is not a participant in the conversation') {
                return res.status(403).json({
                    message: 'The user is not a participant in the conversation',
                    token: newToken
                });
            }
            return res.status(500).json({
                message: 'Internal server error',
                token: newToken
            });
        })
}

/* Message delete (Needs token)
    * @param {Object} req - request object
    * @param {String} req.params.id - message id
    * @param {String} req.body.userId - user id
    * @param {String} req.body.token - token
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function deleteMessage(req, res) {
    /* Check if the request is valid */
    if (!req.body.userId || !req.body.token) {
        return res.status(400).send({
            message: 'Invalid request'
        });
    }

    /* Check if the token is valid */
    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${req.body.userId}/token`, {
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

            /* Delete the message */
            fetch(`http://localhost:${process.env.MESSAGE_SERVICE_PORT}/messages/${req.params.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    return response.json()
                })
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

/* Message update (Needs token)
    * @param {Object} req - request object
    * @param {String} req.params.id - message id
    * @param {String} req.body.userId - user id
    * @param {String} req.body.token - token
    * @param {Object} req.body.content - content
    * @param {String} req.body.content.message - message
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function updateMessage(req, res) {
    /* Check if the request is valid */
    if (!req.body.userId || !req.body.token || !req.body.content || !req.body.content.message) {
        return res.status(400).send({
            message: 'Invalid request'
        });
    }

    /* Check if the token is valid */
    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${req.body.userId}/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: req.body.token})
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.message === 'Invalid token') {
                return res.status(401).send({
                    message: 'Invalid token'
                });
            }

            /* Update the message */
            fetch(`http://localhost:${process.env.MESSAGE_SERVICE_PORT}/messages/${req.params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({content: req.body.content})
            })
                .then(response => {
                    return response.json()
                })
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

module.exports = {
    login,
    register,
    updateUser,
    getUser,
    getAllUsers,
    getAllConversations,
    getConversation,
    getConversationMessages,
    createConversation,
    deleteConversation,
    updateConversation,
    addParticipant,
    removeParticipant,
    getParticipants,
    createMessage,
    deleteMessage,
    updateMessage
}
