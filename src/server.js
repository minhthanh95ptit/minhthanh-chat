// var express = require("express")
import express from "express"
import connectDB from "./config/connectDB"

let app = express()

//CONNECT TO MONGODB
connectDB()

let hostname = "localhost"
let port = 8017

app.get("/",(req,res) => {
    res.send("<h1>Hello Pham Minh Thanh</h1>")
});

app.listen(process.env.APP_PORT, process.env.APP_HOST,() => {
    console.log(`Running at ${process.env.APP_HOST}:${process.env.APP_PORT}`)
})
