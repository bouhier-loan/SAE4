const axios = require('axios');

async function authenticator(req, res, next) {
    try {
        const tmp = req.headers.authorization.split(' ');
        const user = tmp[0];
        const token = tmp[1];

        const response = await axios.post(
            process.env.API_URL + process.env.USER_SERVICE_PORT + '/users/' + user + '/token/check',
            {
                token: token
            });

        if (response.status !== 200) {
            return res.status(401).json(
                {message: 'Unauthorized'}
            );
        }

        req.userId = user;
        next();

    } catch(err) {
        return res.status(401).json(
            {message: 'Unauthorized'}
        );
    }
}

module.exports = authenticator;