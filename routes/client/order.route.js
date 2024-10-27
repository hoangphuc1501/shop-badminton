const express = require("express");
const route = express.Router();

const controller = require("../../controllers/client/order.controller");

route.get("/", controller.index);
route.post("/", controller.orderPost);
module.exports = route;