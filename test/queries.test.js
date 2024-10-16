const { expect } = require('chai');
const {insertUser} = require("../models/queries");
const db = require("../config/database")

describe('Query Account Table', function () {
    it ('should successfully insert to Account table', async function () {
        let client;

        try {
            client = await db.connect()
            await insertUser("John", "Doe", "johndoe", "securepassword", 1); // Insert user into the table

            const result = await client.query(`SELECT * FROM account WHERE username = $1`, ["johndoe"])
            expect(result.rows).to.have.lengthOf(1)
            expect(result.rows[0]).to.include({ first_name: "John", last_name: "Doe", username: "johndoe", membership_id: 1 })
        } catch (error) {
            expect.fail('Failed to insert into Account table: ' + error.message)
        } finally {
            if (client) {
                await client.query(`DELETE FROM account WHERE username = $1`, ["johndoe"])
                client.release();
            }
        }
    })
})