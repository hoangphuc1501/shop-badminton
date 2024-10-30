const express = require("express");
const route = express.Router();

const controller = require("../../controllers/client/user.controller");
const userMiddleware = require("../../middlewares/client/user.middleware");
route.get("/register", controller.register);
route.post("/register", controller.registerPost);
route.get("/login", controller.login);
route.post("/login", controller.loginPost);
route.get("/logout", controller.logout);
route.get("/profile", 
    userMiddleware.profile,
    controller.profile);
route.get("/update-info", controller.updateInfo);
route.patch("/update-info/:id", controller.updateInfoPatch);
module.exports = route;