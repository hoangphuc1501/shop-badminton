const express = require("express");
const route = express.Router();
const multer  = require('multer');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = multer();


const uploadCloud = require("../../middlewares/admin/uploadcloud.middleware");
const controller = require("../../controllers/admin/account.controller");

route.get("/", controller.index);
route.patch("/change-status", controller.changeStatus);
route.patch("/change-multi", controller.changeMulti);
route.patch("/delete", controller.delete);
route.get("/create", controller.create);
route.post("/create",
    upload.single('avatar'),
    uploadCloud.uploadSingle,
    controller.createPost);

route.get("/edit/:id", controller.edit);

route.patch("/edit/:id",
    upload.single('avatar'),
    uploadCloud.uploadSingle,
    controller.editPatch);

route.get("/change-password/:id", controller.changePassword);
route.patch("/change-password/:id", controller.changePasswordPatch);
route.get("/my-profile", controller.myProfile);
module.exports = route;