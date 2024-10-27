const User = require("../../models/user.model");
const md5 = require("md5");

const generateHelper = require("../../helpers/generate.helper");
module.exports.register = (req, res) => {
    res.render("client/pages/users/register",{
        pageTitle: "Đăng ký tài khoản"
    })
}

module.exports.registerPost = async (req, res) => {
    const user = req.body;
    const existUser = await User.findOne({
        email: user.email,
        deleted: false
    });
    if(existUser){
        // req.flash("error", "email đã tồn tại trong hệ thống!");
        res.redirect("back");
        return;
    }
    const dataUser = {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        password: md5(user.password),
        token: generateHelper.generateRandomString(30),
        status: "active"
    };
    const newUser = new User(dataUser);
    await newUser.save();

    res.cookie("tokenUser", newUser.token);
    req.flash("success", "Đăng ký tài khoản thành công!");
    res.redirect("/");
}