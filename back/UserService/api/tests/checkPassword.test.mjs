// checkPassword.test.mjs

const { checkPassword } = require('../Controllers/userController.mjs'); // Importez la fonction checkPassword
const User = require('../models/user'); // Importez le modèle User si nécessaire
const bcrypt = require('bcrypt'); // Importez bcrypt si nécessaire

describe('checkPassword function', () => {
    test('Should return "Password valid" if password is correct', async () => {
        // Mock req and res objects
        const req = {
            params: {
                id: 'id_utilisateur'
            },
            body: {
                password: 'mot_de_passe_correct'
            }
        };

        // Mock User.findOne to return a user
        User.findOne = jest.fn().mockReturnValue({ password: await bcrypt.hash('mot_de_passe_correct', 10) });

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
        await checkPassword(req, res);

        // Verify the response
        expect(sentStatus).toBe(200);
        expect(sentData.message).toBe('Password valid');
    });

    test('Should return "User not found" if user does not exist', async () => {
        // Mock req and res objects
        const req = {
            params: {
                id: 'id_inconnu'
            },
            body: {
                password: 'mot_de_passe_correct'
            }
        };

        // Mock User.findOne to return undefined (simulate non-existing user)
        User.findOne = jest.fn().mockReturnValue(undefined);

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
        await checkPassword(req, res);

        // Verify the response
        expect(sentStatus).toBe(404);
        expect(sentData.message).toBe('User not found');
    });

    test('Should return "Invalid password" if password is incorrect', async () => {
        // Mock req and res objects
        const req = {
            params: {
                id: 'id_utilisateur'
            },
            body: {
                password: 'mot_de_passe_incorrect'
            }
        };

        // Mock User.findOne to return a user
        User.findOne = jest.fn().mockReturnValue({ password: await bcrypt.hash('mot_de_passe_correct', 10) });

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
        await checkPassword(req, res);

        // Verify the response
        expect(sentStatus).toBe(400);
        expect(sentData.message).toBe('Invalid password');
    });
});
