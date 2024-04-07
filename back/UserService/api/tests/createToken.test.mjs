// createToken.test.mjs

const { createToken } = require('../Controllers/userController.mjs'); // Importez la fonction createToken
const AccessToken = require('../models/accessToken'); // Importez le modèle AccessToken si nécessaire
const { v4: uuidv4 } = require('uuid'); // Importez uuid pour générer des jetons

describe('createToken function', () => {
    test('Should create a new token for the user', async () => {
        // Mock req and res objects
        const req = {
            params: {
                id: 'id_utilisateur'
            }
        };

        let savedToken;

        // Mock AccessToken.deleteMany to do nothing
        AccessToken.deleteMany = jest.fn().mockResolvedValue();

        // Mock uuidv4 to return a token
        uuidv4 = jest.fn().mockReturnValue('jeton_généré');

        // Mock dateShift to return a date
        dateShift = jest.fn().mockReturnValue(new Date());

        // Mock AccessToken.save to save the token
        AccessToken.save = jest.fn().mockImplementation((token) => {
            savedToken = token;
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
        await createToken(req, res);

        // Verify the response
        expect(sentStatus).toBe(201);
        expect(sentData.message).toBe('Token created successfully');
        expect(sentData.token).toBe('jeton_généré');

        // Verify the saved token
        expect(savedToken).toBeDefined();
        expect(savedToken.token).toBe('jeton_généré');
        expect(savedToken.userId).toBe('id_utilisateur');
    });
});
