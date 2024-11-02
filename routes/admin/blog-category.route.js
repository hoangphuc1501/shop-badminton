const express = require("express");
const route = express.Router();
const controller = require("../../controllers/admin/blog-category.controller");

route.get("/", controller.index);
route.get("/create", controller.create);
route.post("/create", controller.createPost);
route.get("/edit/:id", controller.edit);
route.patch("/edit/:id", controller.editPatch);
route.patch("/delete", controller.delete);
route.patch("/change-status", controller.changeStatus);
route.patch("/change-multi", controller.changeMulti);
route.patch("/change-position", controller.changePosition);
module.exports = route;