// updateUser.test.mjs

const { updateUser } = require('../Controllers/userController.mjs'); // Importez la fonction updateUser
const User = require('../models/user'); // Importez le modèle User si nécessaire
const bcrypt = require('bcrypt'); // Importez bcrypt si nécessaire

describe('updateUser function', () => {
    test('Should update user information successfully', async () => {
        // Mock req and res objects
        const req = {
            params: {
                id: 'id_utilisateur_existant'
            },
            body: {
                displayName: 'nouveau_nom',
                password: 'nouveau_mot_de_passe'
            }
        };

        // Mock User.findOne to return a user
        User.findOne = jest.fn().mockReturnValue({
            id: 'id_utilisateur_existant',
            username: 'nom_utilisateur',
            displayName: 'ancien_nom',
            password: await bcrypt.hash('ancien_mot_de_passe', 10),
            color: 'couleur_aléatoire'
        });

        // Mock bcrypt.hash to return hashed password
        bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');

        let savedUser;

        // Mock User.save to save the updated user
        User.save = jest.fn().mockImplementation((user) => {
            savedUser = user;
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
        await updateUser(req, res);

        // Verify the response
        expect(sentStatus).toBe(200);
        expect(sentData.message).toBe('User information updated successfully');
        expect(sentData.user).toBeDefined();
        expect(savedUser).toBeDefined();
        expect(savedUser.id).toBe('id_utilisateur_existant');
        expect(savedUser.username).toBe('nom_utilisateur');
        expect(savedUser.displayName).toBe('nouveau_nom');
    });

    test('Should return "User not found" if user does not exist', async () => {
        // Mock req and res objects
        const req = {
            params: {
                id: 'id_inconnu'
            },
            body: {
                displayName: 'nouveau_nom',
                password: 'nouveau_mot_de_passe'
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
        await updateUser(req, res);

        // Verify the response
        expect(sentStatus).toBe(404);
        expect(sentData.message).toBe('User not found');
    });
});
