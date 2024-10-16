const { Router } = require('express')
const appRouter = Router()
const appController = require('../controllers/appController')

appRouter.get("/sign-up", appController.signUpGet)
appRouter.post("/sign-up", appController.signUpPost)
appRouter.get("/join-club", appController.joinClubGet)
// appRouter.post("/join-club", appController.joinClubPost)
appRouter.get("/log-in", appController.logInGet)
// appRouter.post("/log-in", appController.logInPost)
module.exports = appRouter