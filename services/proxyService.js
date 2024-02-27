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
        return res.status(400).send('Invalid request');
    }

    /* Get the token */
    fetch('http://localhost:3000/', { //TODO: Change to user service correct route
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User not found') {
            return res.status(404).send('User not found');
        }

        return res.status(200).json(data);
    })
}

module.exports = {
    login,
}