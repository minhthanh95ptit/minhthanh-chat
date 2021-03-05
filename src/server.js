// var express = require("express")
import express from "express"
import connectDB from "./config/connectDB"
import configViewEngine from "./config/viewEngine"
import initRoutes from "./routes/web"
import bodyParser from "body-parser"
import connectFlash from "connect-flash"
import session from "./config/session"
import passport from "passport"
import http from "http"
import socketio from "socket.io"
import initSockets from "./sockets/index"
import configSocketIo from "./config/socketio"
import passportSocketIo from "passport.socketio"
import cookieParser from "cookie-parser"

import pem from "pem"
import https from "https"



// pem.createCertificate({days: 1, selfSigned: true}, function (err, keys){

//     if(err){
//         throw err
//     }
//     // Init app
//     let app = express()

//     //CONNECT TO MONGODB
//     connectDB()

//     // Config session
//     configSession(app)

//     // Config view engine
//     configViewEngine(app)

//     //Enable post data request
//     app.use(bodyParser.urlencoded({extended:true}))

//     //Enable flash messages
//     app.use(connectFlash())

//     //config passport js
//     app.use(passport.initialize())
//     app.use(passport.session()) // quan trong
//     //Init all route
//     initRoutes(app);

//     https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT, process.env.APP_HOST, () => {
//         console.log(`running on ${process.env.APP_PORT}: ${process.env.APP_HOST}`);
//     })
// })

//  Init app
let app = express()

// Init server with socket.io & express app

let server = http.createServer(app)
let io = socketio(server);

//CONNECT TO MONGODB
connectDB()

// Config session
session.config(app)

// Config view engine
configViewEngine(app)

//Enable post data request
app.use(bodyParser.urlencoded({extended:true}))

//Enable flash messages
app.use(connectFlash())

// User Cookie Parser
app.use(cookieParser())

//config passport js
app.use(passport.initialize())
app.use(passport.session()) // quan trong
//Init all route
initRoutes(app);

// Config for socketIO
configSocketIo(io, cookieParser, session.sessionStore)

//Init all sockets
initSockets(io);

let hostname = "localhost"
let port = 8017

app.get("/",(req,res) => {
    res.send("<h1>Hello Pham Minh Thanh</h1>")
});

server.listen(process.env.APP_PORT, process.env.APP_HOST,() => {
    console.log(`Running at ${process.env.APP_HOST}:${process.env.APP_PORT}`)
})
