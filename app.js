const express = require('express')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const appRouter = require('./routers/appRouter')

const app = express()
app.set("views", __dirname + "/views")
app.set("view engine", "ejs")

app.use(express.urlencoded({extended: true}))
app.use("/", appRouter)

app.listen(3000, () => console.log("Listening"))