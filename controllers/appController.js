const Account = require("../models/account")
const Message = require("../models/message")
const { body, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")

exports.indexGet = async (req, res) => {
    const authenticated = req.session.passport?.user
    const messages = authenticated
                    ? await Message.getAllMessagesNamed()
                    : await Message.getAllMessagesAnonymous()
    res.render("index", {title: "Main", authenticated, messages})
}

exports.signUpGet = (req, res) => {
    res.render("sign-up", {title: "Sign Up", errors: []})
}

// todo: write tests for validateUser
const validateUser = [
    body("first_name").trim()
        .isAlpha().withMessage("First name must only contain letters"),

    body("last_name").trim()
        .isAlpha().withMessage("Last name must only contain letters"),

    body("username").trim()
        .matches(/^\S*$/).withMessage("Username must not contain spaces") // Check for spaces
        .custom(async (value) => {
            const result = await Account.findByUsername(value)
            if (result.length !== 0) {
                throw new Error("Username already in use")
            }
            return true
        }),

    body("password")
        .isLength({ min: 12, max: 16 }).withMessage("Password just be between 12 and 16 characters")
        .matches(/\d/).withMessage("Password must contain at least one number")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/\W/).withMessage("Password must contain at least one special character"),

    body("confirm_password")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match")
            }
            return true
        }),
]

exports.signUpPost = [
    validateUser,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .render("sign-up", {title: "Sign Up", errors: errors.array()})
        }

        const NO_MEMBERSHIP = 1
        const { first_name, last_name, username, password } = req.body
        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            await Account.insertUser(
                first_name,
                last_name,
                username,
                hashedPassword,
                NO_MEMBERSHIP,
            )
            req.session.regenerate(async (err) => {
                if (err) {
                    return res.status(500).send("Error regenerating session")
                }
                const result = await Account.getIdFromUsername(username)
                const newUserId = result[0].account_id
                req.session.passport = { user: newUserId }

                res.redirect("/")
            })
        } catch(error) {
            console.error("Error inserting user", error)
            res.status(500).render("sign-up", { title: "Sign Up", errors: ["Internal Service Error"]})
        }
    }
]

exports.joinClubGet =  (req, res) => {
    res.render("join-club", {title: "Join Club", errors: []})
}

exports.joinClubPost = async (req, res) => {
    // Check if the user is authenticated
    if (!req.session.passport || !req.session.passport.user) {
        return res.status(401).send('User not authenticated') // or redirect to login
    }

    const account_id = req.session.passport.user

    try {
        await Account.updateToMember(account_id)
        res.redirect("/")
    } catch (error) {
        console.error('Error updating membership:', error)
        res.status(500).send('An error occurred while joining the club')
    }
}


exports.logInGet = (req, res) => {
    res.render("login", {title: "Log In", errors: []})
}

exports.logOutPost = (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error)
        }
        res.redirect("/")
    })
}

exports.newMessagePost = async (req, res) => {
    await Message.insertMessage(
        req.session.passport.user,
        new Date(),
        req.body.title,
        req.body.text,
    )
    res.redirect("/")
}