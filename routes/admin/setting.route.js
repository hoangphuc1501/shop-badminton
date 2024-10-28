const express = require("express");
const route = express.Router();
const multer  = require('multer');
const upload = multer();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const controller = require("../../controllers/admin/setting.controller");

route.get("/general", controller.general);

route.patch(
    "/general",
    upload.single('logo'),
    uploadCloud.uploadSingle,
    controller.generalPatch
);

module.exports = route;