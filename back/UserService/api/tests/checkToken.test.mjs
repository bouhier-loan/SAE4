// checkToken.test.mjs

const { checkToken } = require('../Controllers/userController.mjs'); // Importez la fonction checkToken
const AccessToken = require('../models/accessToken'); // Importez le modèle AccessToken si nécessaire

describe('checkToken function', () => {
    test('Should return "Token valid" if token is valid', async () => {
        // Mock req and res objects
        const req = {
            params: {
                id: 'id_utilisateur'
            },
            body: {
                token: 'token_valide'
            }
        };

        // Mock AccessToken.findOne to return a valid token
        AccessToken.findOne = jest.fn().mockReturnValue({
            expires: new Date(Date.now() + 1000) // Token expires in future
        });

        let sentStatus;
        let sentData;

        const res = {
            status: function (status) {
                sentStatus = status;
                return this;
            },
            json: function (data) {
                sentData = data;
            }
        };

        // Run the function
        await checkToken(req, res);

        // Verify the response
        expect(sentStatus).toBe(200);
        expect(sentData.message).toBe('Token valid');
    });

    test('Should return "Token expired" if token has expired', async () => {
        // Mock req and res objects
        const req = {
            params: {
                id: 'id_utilisateur'
            },
            body: {
                token: 'token_expire'
            }
        };

        // Mock AccessToken.findOne to return an expired token
        AccessToken.findOne = jest.fn().mockReturnValue({
            expires: new Date(Date.now() - 1000) // Token expired in past
        });

        let sentStatus;
        let sentData;

        const res = {
            status: function (status) {
                sentStatus = status;
                return this;
            },
            json: function (data) {
                sentData = data;
            }
        };

        // Run the function
        await checkToken(req, res);

        // Verify the response
        expect(sentStatus).toBe(400);
        expect(sentData.message).toBe('Token expired');
    });

    test('Should return "Token not found" if token does not exist', async () => {
        // Mock req and res objects
        const req = {
            params: {
                id: 'id_inconnu'
            },
            body: {
                token: 'token_valide'
            }
        };

        // Mock AccessToken.findOne to return undefined (simulate non-existing token)
        AccessToken.findOne = jest.fn().mockReturnValue(undefined);

        let sentStatus;
        let sentData;

        const res = {
            status: function (status) {
                sentStatus = status;
                return this;
            },
            json: function (data) {
                sentData = data;
            }
        };

        // Run the function
        await checkToken(req, res);

        // Verify the response
        expect(sentStatus).toBe(404);
        expect(sentData.message).toBe('Token not found');
    });
});
