// getAllUsers.test.mjs

const { getAllUsers } = require('../Controllers/userController.mjs'); // Importez la fonction getAllUsers
const User = require('../models/user'); // Importez le modèle User si nécessaire

describe('getAllUsers function', () => {
    test('Should return users with specified username', async () => {
        // Mock req and res objects
        const req = {
            query: {
                username: 'nom_utilisateur_existant'
            }
        };

        // Mock User.find to return users with specified username
        User.find = jest.fn().mockReturnValue([
            { id: 'id_utilisateur_1', username: 'utilisateur1', displayName: 'Utilisateur 1', color: 'color1' },
            { id: 'id_utilisateur_2', username: 'utilisateur2', displayName: 'Utilisateur 2', color: 'color2' }
        ]);

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
        await getAllUsers(req, res);

        // Verify the response
        expect(sentStatus).toBe(200);
        expect(sentData.message).toBe('Users found');
        expect(sentData.users).toBeDefined();
        expect(sentData.users.length).toBe(2);
        // Add more assertions as needed
    });

    test('Should return all users if no username specified', async () => {
        // Mock req and res objects
        const req = {
            query: {
                username: ''
            }
        };

        // Mock User.find to return all users
        User.find = jest.fn().mockReturnValue([
            { id: 'id_utilisateur_1', username: 'utilisateur1', displayName: 'Utilisateur 1', color: 'color1' },
            { id: 'id_utilisateur_2', username: 'utilisateur2', displayName: 'Utilisateur 2', color: 'color2' }
        ]);

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
        await getAllUsers(req, res);

        // Verify the response
        expect(sentStatus).toBe(200);
        expect(sentData.message).toBe('Users found');
        expect(sentData.users).toBeDefined();
        expect(sentData.users.length).toBe(2);
    });
});
