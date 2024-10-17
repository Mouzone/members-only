const db = require("../config/database")

exports.insertMessage = async (account_id, timestamp, title, text) => {
    await db.query(
        `INSERT INTO message (account_id, timestamp, title, text) 
        VALUES ($1, $2, $3, $4)`,
        [account_id, timestamp, title, text]
    )
}

exports.getAllMessagesAnonymous = async () => {
    const { rows } = await db.query(
                        `SELECT * FROM message
                        ORDER BY timestamp DESC`
                    )

    return rows
}