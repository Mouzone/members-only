const { expect } = require('chai');
const { insertUser, findUsername } = require("../models/queries");
const db = require("../config/database");

describe('Query Account Table', function () {
    let client

    before(async function () {
        client = await db.connect()
    })

    after(async function () {
        if (client) {
            client.release()
        }
    })

    it('should successfully insert into the Account table', async function () {
        await insertUser("John", "Doe", "johndoe", "securepassword", 1)

        const result = await client.query(`SELECT * FROM account WHERE username = $1`, ["johndoe"])
        expect(result.rows).to.have.lengthOf(1)
        expect(result.rows[0]).to.include({
            first_name: "John",
            last_name: "Doe",
            username: "johndoe",
            membership_id: 1
        })

        await client.query(`DELETE FROM account WHERE username = $1`, ["johndoe"])
    })

    it('should return an empty array when fetching a username that does not exist in Account', async function () {
        const result = await findUsername("johndoe")
        expect(result).to.have.lengthOf(0)
    })
})
