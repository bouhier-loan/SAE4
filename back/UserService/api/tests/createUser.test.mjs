// createUser.test.mjs

const { createUser } = require('../Controllers/userController.mjs'); // Importez la fonction createUser
const User = require('../models/user'); // Importez le modèle User si nécessaire
const bcrypt = require('bcrypt'); // Importez bcrypt si nécessaire

describe('createUser function', () => {
    test('Should create a new user', async () => {
        // Mock req and res objects
        const req = {
            body: {
                username: 'test_user',
                password: 'test_password'
            }
        };

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
        await createUser(req, res);

        // Verify the response
        expect(sentStatus).toBe(201);
        expect(sentData.message).toBe('User registered successfully');
        expect(sentData.user).toBeDefined();
        expect(sentData.user.username).toBe('test_user');
        // Add more assertions as needed
    });

    // Add more tests as needed
});
