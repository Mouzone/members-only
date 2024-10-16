const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
const Account = require("../models/account")

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const { rows } = await Account.findByUsername(username)
            const account = rows[0]

            if (!account) {
                return done(null, false, { message: "Incorrect username." })
            }
            const isMatch = await bcrypt.compare(password, account.password)
            if (!isMatch) {
                return done(null, false, { message: "Incorrect password." })
            }
            return done(null, account)
        } catch(error) {
            return done(error)
        }
    })
)

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await Account.findById(id, (err, account) => done(err, account))
        const user = rows[0]
        done(null, user)
    } catch(error) {
        done(error)
    }
})

module.exports = passport