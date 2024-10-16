const db = require("../config/database")

exports.insertUser = async (first_name, last_name, username, password, membership_id) => {
    await db.query(
        `INSERT INTO account (first_name, last_name, username, password, membership_id)
        VALUES ($1, $2, $3, $4, $5)`,
        [first_name, last_name, username, password, membership_id]
        )
}

exports.findUsername = async (username) => {
    const { rows } = await db.query(
        `SELECT * FROM account
        WHERE username = $1`,
        [username]
    )

    return rows
}