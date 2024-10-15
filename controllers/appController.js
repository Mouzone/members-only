const queries = require("../models/queries")

module.exports.signUpGet = (req, res) => {
    res.render("sign-up", {title: "Sign Up"})
}

module.exports.signUpPost = async (req, res) => {
    await queries.insertUser(
        req.body.first_name,
        req.body.last_name,
        req.body.username,
        req.body.password
    )

    res.redirect("/")
}