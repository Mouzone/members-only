const db = require("../config/database")

module.exports.insertUser = async (first_name, last_name, username, password) => {
    await db.query(
        `INSERT INTO account (first_name, last_name, username, password)
        VALUES ($1, $2, $3, $4)`,
        [first_name, last_name, username, password]
        )
}