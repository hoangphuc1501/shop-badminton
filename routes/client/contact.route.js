const express = require("express");
const route = express.Router();

const controller = require("../../controllers/client/contact.controller");

route.get("/", controller.index);
route.post("/", controller.contactPost);
module.exports = route;