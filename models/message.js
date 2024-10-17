const db = require("../config/database")

exports.insertMessage = async (account_id, timestamp, title, text) => {
    await db.query(
        `INSERT INTO message (account_id, timestamp, title, text) 
        VALUES ($1, $2, $3, $4)`,
        [account_id, timestamp, title, text]
    )
}