const db = require("../config/database")

module.exports.insertUser = async (username, password) => {
    await db.query("INSERT VALUES (username, password")
}