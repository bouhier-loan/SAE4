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

    /* Get the user */
    fetch(`http://localhost:3000/users?username=${req.body.username}`, {
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

            /* Check if the password is correct */
            fetch(`http://localhost:3000/users/${user.id}/password`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }})
                .then(response => { return response.json() })
                .then(data => {
                    if (data.message === 'Invalid password') {
                        return res.status(401).send({
                            message: 'Invalid password'
                        });
                    }
                    fetch(`http://localhost:3000/users/${user.id}/token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({password: req.body.password})
                    })
                        .then(response => { return response.json() })
                        .then(data => {
                            return res.status(200).send({
                                message: 'Login successful',
                                token: data.token
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
        })
    .catch(error => {
        console.log(error);
        return res.status(500).send({
            message: 'Internal server error'
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
    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
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
}

/* User update
    * @param {Object} req - request object
    * @param {String} req.params.id - user id
    * @param {String} req.body.displayName - display name
    * @param {String} req.body.password - password
    * @param {Object} res - response object
    * @return {Object} - The response object
 */


module.exports = {
    login,
    register
};