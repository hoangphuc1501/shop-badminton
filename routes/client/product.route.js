const express = require("express");
const route = express.Router();

const controller = require("../../controllers/client/product.controller");

route.get("/", controller.index);

route.get("/detail/:slug", controller.detail);
route.get("/search", controller.search);
route.get("/favorite", controller.favorite);
route.patch("/change-favorite", controller.changeFavorite);
route.get("/:slugCategory", controller.category);

module.exports = route;