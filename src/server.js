// var express = require("express")
import express from "express"
import connectDB from "./config/connectDB"
import configViewEngine from "./config/viewEngine"
import initRoutes from "./routes/web"
import bodyParser from "body-parser"
import connectFlash from "connect-flash"
import configSession from "./config/session"
import passport from "passport"

// Init app
let app = express()

//CONNECT TO MONGODB
connectDB()

// Config session
configSession(app)

// Config view engine
configViewEngine(app)

//Enable post data request
app.use(bodyParser.urlencoded({extended:true}))

//Enable flash messages
app.use(connectFlash())

//config passport js
app.use(passport.initialize())
//Init all route
initRoutes(app);

let hostname = "localhost"
let port = 8017

app.get("/",(req,res) => {
    res.send("<h1>Hello Pham Minh Thanh</h1>")
});

app.listen(process.env.APP_PORT, process.env.APP_HOST,() => {
    console.log(`Running at ${process.env.APP_HOST}:${process.env.APP_PORT}`)
})
