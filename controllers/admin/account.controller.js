const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require('md5');

const generateHelper = require("../../helpers/generate.helper");
const systemConfig = require("../../config/system");

module.exports.index = (req, res) => {
    res.render("admin/pages/accounts/index.pug",{
        title: "Danh sách tài khoản"
    });
}

module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    });
    res.render("admin/pages/accounts/create.pug",{
        title: "Tạo tài khoản",
        roles: roles
    });
}

module.exports.createPost = async (req, res) => {
    req.body.password = md5(req.body.password)
    req.body.token = generateHelper.generateRandomString(30);

    const account = new Account(req.body);
    await account.save();
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}