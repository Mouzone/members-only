const { Router } = require('express')
const appRouter = Router()
const appController = require('../controllers/appController')

appRouter.get("/sign-up", appController.signUpGet)
appRouter.post("/sign-up", appController.signUpPost)

module.exports = appRouter