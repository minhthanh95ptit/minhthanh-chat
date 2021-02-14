import express from "express"
import {home, auth} from "./../controllers/index"

let router = express.Router()

// Init all route
/*
  @param app from exactly express module
*/

let initRoutes = (app) => {

  app.get("/", home.getHome)

  app.get("/login-register", auth.getLoginRegister)

  return app.use("/", router)
}

module.exports = initRoutes