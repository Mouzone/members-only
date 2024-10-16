const queries = require("../models/queries")
const { body, validationResult } = require("express-validator")

module.exports.signUpGet = (req, res) => {
    res.render("sign-up", {title: "Sign Up"})
}

const validateUser = [
    body("first_name").trim()
        .isAlpha().withMessage("First name must only contain letters"),
    body("last_name").trim()
        .isAlpha().withMessage("Last name must only contain letters"),
    body("username").trim()
        .custom(async (value, {req}) => {
            const result = await queries.findUsername(value)
            return result.length === 0
        }).withMessage("Username already in use"),
    body("password")
        .isLength({ min: 12, max: 16 }).withMessage("Password just be between 12 and 16 characters")
        .matches(/\d/).withMessage("Password must contain at least one number")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/\W/).withMessage("Password must contain at least one special character"),,
    body("confirm_password")
        .custom((value, { req }) => {
            return value === req.body.password
        }).withMessage("Passwords do not match"),
]

module.exports.signUpPost = [
    validateUser,
    async (req, res) => {
        const NO_MEMBERSHIP = 1
        if (req.body.password !== req.body.confirm_password) {
            // add errors
            res.render("sign-up", {title: "Sign Up"})
        }

        await queries.insertUser(
            req.body.first_name,
            req.body.last_name,
            req.body.username,
            req.body.password,
            NO_MEMBERSHIP,
        )

        res.redirect("/")
    }
]