const { Router } = require('express')
const appRouter = Router()
const appController = require('../controllers/appController')
const passport = require('../config/passport')

appRouter.get("/", appController.indexGet)

appRouter.get("/sign-up", appController.signUpGet)
appRouter.post("/sign-up", appController.signUpPost)

appRouter.get("/join-club", appController.joinClubGet)
appRouter.post("/join-club", appController.joinClubPost)

appRouter.get("/login", appController.logInGet)
appRouter.post("/login",
    passport.authenticate(
    "local",
        {successRedirect: "/", failureRedirect: "/login"}
    )
)

appRouter.post("/logout", appController.logOutPost)

appRouter.post("/new-message", appController.newMessagePost)

appRouter.post("/delete-message/:message_id", appController.deleteMessagePost)

module.exports = appRouter