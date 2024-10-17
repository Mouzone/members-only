const db = require("../config/database")

exports.insertUser = async (first_name, last_name, username, password, membership_id) => {
    await db.query(
        `INSERT INTO account (first_name, last_name, username, password, membership_id)
        VALUES ($1, $2, $3, $4, $5)`,
        [first_name, last_name, username, password, membership_id]
    )
}

exports.findByUsername = async (username) => {
    const { rows } = await db.query(
                        `SELECT account_id, username, password FROM account
                        WHERE username = $1`,
                        [username]
                    )
    return rows
}

exports.findById = async (account_id) => {
    const { rows } = await db.query(
                        `SELECT * FROM account
                        WHERE account_id = $1`,
                        [account_id]
                    )

    return rows
}

exports.updateToMember = async (account_id) => {
    await db.query(
        `UPDATE account
        SET membership_id = 2
        WHERE account_id = $1`,
        [account_id]
    )
}

exports.getIdFromUsername = async (username) => {
    const { rows } = await db.query(
                        `SELECT account_id FROM account
                        WHERE username = $1`,
                        [username]
                    )

    return rows
}

exports.getMembershipIdFromId = async (account_id) => {
    const { rows } = await db.query(
        `SELECT membership_id FROM account
        WHERE account_id = $1`,
        [account_id]
    )

    return rows
}