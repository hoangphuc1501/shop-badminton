const express = require("express");
const route = express.Router();
const controller = require("../../controllers/admin/trash.controller");

route.get("/", controller.productCategory);
route.get("/trash-products", controller.product);
route.get("/trash-blogs-category", controller.blogsCategory);
route.get("/trash-blogs", controller.blogs);
route.get("/trash-role", controller.role);
route.get("/trash-account", controller.account);
route.delete("/delete", controller.delete);
route.patch("/restore", controller.restore);
module.exports = route;