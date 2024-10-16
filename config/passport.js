const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
const Account = require("../models/account")

// todo: write test for passport
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const { rows } = await Account.findByUsername(username)
            const user = rows[0]

            if (!user) {
                return done(null, false, { message: "Incorrect username." })
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return done(null, false, { message: "Incorrect password." })
            }
            return done(null, user)
        } catch(error) {
            return done(error)
        }
    })
)

passport.serializeUser((user, done) => done(null, user.account_id))
passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await Account.findById(id)
        const user = rows[0]
        if (!user) {
            return done(null, false)
        }

        done(null, user)
    } catch(error) {
        done(error)
    }
})

module.exports = passport