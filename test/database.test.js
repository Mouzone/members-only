const { expect } = require('chai');
const pool = require('../config/database'); 

describe('Database Connection', function () {
    it('should successfully connect to the database', async function () {
        let client;

        try {
            client = await pool.connect();
            expect(client).to.not.be.null;
        } catch (error) {
            expect.fail('Failed to connect to the database: ' + error.message);
        } finally {
            if (client) client.release();
        }
    });
});
