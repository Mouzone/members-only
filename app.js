const express = require('express')
const appRouter = require('./routers/appRouter')
const passport = require("/config/passport")
const session = require("/config/session")

const app = express()
app.set("views", __dirname + "/views")
app.set("view engine", "ejs")

app.use(express.urlencoded({extended: true}))
app.use(session)
app.use(passport.initialize())
app.use(passport.session())
app.use("/", appRouter)

app.listen(3000, () => console.log("Listening"))