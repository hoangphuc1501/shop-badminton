const express = require("express");
const route = express.Router();

const controller = require("../../controllers/client/cart.controller");

route.post("/add/:id", controller.addPost);

module.exports = route;