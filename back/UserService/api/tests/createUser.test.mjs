// createUser.test.mjs

const { createUser } = require('../Controllers/userController.mjs'); // Importez la fonction createUser
const User = require('../models/user'); // Importez le modèle User si nécessaire
const bcrypt = require('bcrypt'); // Importez bcrypt si nécessaire

describe('createUser function', () => {
    test('Should return "User already exists" if username already exists', async () => {
        // Mock req and res objects
        const req = {
            body: {
                username: 'utilisateur_existant'
            }
        };

        let sentStatus;
        let sentData;

        // Mock User.findOne to return a user (simulate existing user)
        User.findOne = jest.fn().mockReturnValue({});

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
        await createUser(req, res);

        // Verify the response
        expect(sentStatus).toBe(400);
        expect(sentData.message).toBe('User already exists');
    });

    test('Should create a new user if username does not exist', async () => {
        // Mock req and res objects
        const req = {
            body: {
                username: 'nouvel_utilisateur'
            }
        };

        let sentStatus;
        let sentData;

        // Mock User.findOne to return undefined (simulate non-existing user)
        User.findOne = jest.fn().mockReturnValue(undefined);

        // Mock bcrypt.hash to return a hashed password
        bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');

        // Mock Math.floor and Math.random to return a color
        Math.floor = jest.fn().mockReturnValue(0);
        Math.random = jest.fn().mockReturnValue(0);

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
        await createUser(req, res);

        // Verify the response
        expect(sentStatus).toBe(201);
        expect(sentData.message).toBe('User registered successfully');
        expect(sentData.user).toBeDefined();
        expect(sentData.user.username).toBe('nouvel_utilisateur');
    });
});

