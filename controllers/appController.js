const queries = require("../models/queries")
const { body, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")

exports.signUpGet = (req, res) => {
    res.render("sign-up", {title: "Sign Up"})
}

const validateUser = [
    body("first_name").trim()
        .isAlpha().withMessage("First name must only contain letters"),

    body("last_name").trim()
        .isAlpha().withMessage("Last name must only contain letters"),

    body("username").trim()
        .matches(/^\S*$/).withMessage("Username must not contain spaces") // Check for spaces
        .custom(async (value) => {
            const result = await queries.findUsername(value)
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
            await queries.insertUser(
                first_name,
                last_name,
                username,
                hashedPassword,
                NO_MEMBERSHIP,
            )
            res.redirect("/")
        } catch(error) {
            console.error("Error inserting user", error)
            res.status(500).render("sign-up", { title: "Sign Up", errors: ["Internal Service Error"]})
        }
    }
]