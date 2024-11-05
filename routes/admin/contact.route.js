const express = require("express");
const route = express.Router();
const controller = require("../../controllers/admin/contact.controller");

route.get("/", controller.index);
route.patch("/delete", controller.delete);

module.exports = route;