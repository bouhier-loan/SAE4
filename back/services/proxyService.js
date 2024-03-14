/* User */

/* User login
    * @param {Object} req - request object
    * @param {String} req.body.username - username
    * @param {String} req.body.password - password
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function login(req, res) {
    /* Check if the request is valid */
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({
            message: 'Invalid request'
        });
    }

    console.log(JSON.stringify(req.body))

    /* Get the user */
    console.info('Get the user')
    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users?username=${req.body.username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }})
        .then(response => { return response.json() })
        .then(data => {
            if (data.users.length === 0) {
                return res.status(404).send({
                    message: 'User not found'
                });
            }
            let user = data.users[0];
            console.log('User found: ', JSON.stringify(user))

            /* Check if the password is correct */
            console.info('Check if the password is correct')
            fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${user.id}/password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body)
            })
                .then(response => { return response.json() })
                .then(data => {
                    if (data.message === 'Invalid password') {
                        return res.status(401).send({
                            message: 'Invalid password'
                        });
                    }
                    console.info('Create a new token for the user')
                    fetch(`http://localhost:${process.env.USER_SERVICE_PORT}/users/${user.id}/token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({password: req.body.password})
                    })
                        .then(response => { return response.json() })
                        .then(data => {
                            console.log('Token created: ', JSON.stringify(data))
                            return res.status(200).send({
                                message: 'Login successful',
                                token: data.token,
                                userId: user.id
                            });
                        });
                });
        });
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


/* Conversation */

/* Conversation get all (Needs token)
    * @param {Object} req - request object
    * @param {String} req.body.userId - user id
    * @param {String} req.body.token - token
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function getAllConversations(req, res) {
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

            /* Get all conversations */
            fetch(`http://localhost:${process.env.MESSAGE_SERVICE_PORT}/conversations?userId=${req.body.userId}`, {
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

    /* Remove the Bearer from the token */
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
            return res.status(500).send({
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
        .catch(error => {
            console.log(error);
            return res.status(500).send({
                message: 'Internal server error',
                token: newToken
            });
        });
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
    * @param {String} req.body.userId - user id
    * @param {String} req.body.token - token
    * @param {String} req.body.participantId - participant id
    * @param {Object} res - response object
    * @return {Object} - The response object
 */
async function addParticipant(req, res) {
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
        return res.status(400).send({
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
                return res.status(401).send({
                    message: 'Invalid token'
                });
            }
            newToken = data.newToken;
    });

    console.log(userId)
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
            console.log('Message created: ', newToken)
            if (data.message === 'Message created') {
                console.log('Message created: ', newToken)
                return res.status(200).send({
                    message: 'Message created',
                    token: newToken
                });
            }
            if (data.message === 'Conversation not found') {
                return res.status(404).send({
                    message: 'Conversation not found',
                    token: newToken
                });
            }
            if (data.message === 'The user is not a participant in the conversation') {
                return res.status(403).send({
                    message: 'The user is not a participant in the conversation',
                    token: newToken
                });
            }
            return res.status(500).send({
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