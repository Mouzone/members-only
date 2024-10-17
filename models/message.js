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
                        `SELECT text, title FROM message
                        ORDER BY timestamp DESC`
                    )

    return rows
}

exports.getAllMessagesNamed = async () => {
    const { rows} = await db.query(
        `SELECT username, timestamp, title, text FROM message
        JOIN account ON message.account_id = account.account_id`
    )

    return rows
}