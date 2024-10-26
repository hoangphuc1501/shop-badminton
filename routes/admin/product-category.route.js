const express = require("express");
const route = express.Router();
const multer  = require('multer');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = multer();


const uploadCloud = require("../../middlewares/admin/uploadcloud.middleware");
const controller = require("../../controllers/admin/product-category.controller");

route.get("/", controller.index);
route.patch("/change-status", controller.changeStatus);
route.patch("/change-multi", controller.changeMulti);
route.patch("/delete", controller.delete);
route.patch("/change-position", controller.changePosition);
route.get("/create", controller.create);
route.post("/create", 
    upload.single('thumbnail'),
    uploadCloud.uploadSingle,
    controller.createPost
);

route.get("/edit/:id", controller.edit);
route.patch("/edit/:id", 
    upload.single('thumbnail'),
    uploadCloud.uploadSingle,
    controller.editPatch
);
module.exports = route;