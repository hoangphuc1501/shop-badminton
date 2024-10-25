const express = require("express");
const route = express.Router();
const multer  = require('multer');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = multer();


const uploadCloud = require("../../middlewares/admin/uploadcloud.middleware");
const controller = require("../../controllers/admin/product-category.controller");

route.get("/", controller.index);
route.get("/create", controller.create);
route.post("/create", 
    upload.single('thumbnail'),
    uploadCloud.uploadSingle,
    controller.createPost
);
module.exports = route;