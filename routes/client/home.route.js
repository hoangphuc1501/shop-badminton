const express = require("express");
const route = express.Router();

const controller = require("../../controllers/client/home.controller");

route.get("/products", controller.index);

module.exports = route;