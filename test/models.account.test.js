const { expect } = require('chai');
const { insertUser, findByUsername, updateToMember} = require("../models/account");
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
    })

    it("should update the membership_id to 2 upon finding the user_id", async function () {
        const query = `SELECT * FROM account WHERE username = $1`
        const params = ["johndoe"]

        // Fetch the account before the update
        const initialResult = await client.query(query, params)
        const accountId = initialResult.rows[0].account_id

        await updateToMember(accountId)

        // Check post update
        const updatedResult = await client.query(query, params)
        expect(updatedResult.rows[0].membership_id).to.equal(2)

        // Cleanup
        await client.query(`DELETE FROM account WHERE username = $1`, params)
    })


    it('should return an empty array when fetching a username that does not exist in Account', async function () {
        const result = await findByUsername("johndoe")
        expect(result).to.have.lengthOf(0)
    })
})
