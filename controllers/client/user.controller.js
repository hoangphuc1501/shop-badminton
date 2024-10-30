const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password");
const md5 = require("md5");

const generateHelper = require("../../helpers/generate.helper");
const sendMailHelper = require("../../helpers/sendMail.helper");
module.exports.register = (req, res) => {
    res.render("client/pages/users/register", {
        pageTitle: "Đăng ký tài khoản"
    })
}

module.exports.registerPost = async (req, res) => {
    const user = req.body;
    const existUser = await User.findOne({
        email: user.email,
        deleted: false
    });
    if (existUser) {
        req.flash("error", "Email đã tồn tại!");
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

module.exports.login = (req, res) => {
    res.render("client/pages/users/login", {
        pageTitle: "Đăng nhập tài khoản"
    })
}
module.exports.loginPost = async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const existUser = await User.findOne({
        email: email,
        deleted: false
    })
    if (!existUser) {
        req.flash("error", "Email không tồn tại!");
        res.redirect("back");
        return;
    }
    if (md5(password) != existUser.password) {
        req.flash("error", "Sai mật khẩu!");
        res.redirect("back");
        return;
    }
    if (existUser.status != "active") {
        req.flash("error", "Tài khoản đang bị khóa!");
        res.redirect("back");
        return;
    }
    res.cookie("tokenUser", existUser.token);
    req.flash("success", "Đăng nhập thành công!");
    res.redirect("/");
}

module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    req.flash("success", "Đăng xuất thành công!");
    res.redirect("/");
}

module.exports.profile = async (req, res) => {

    res.render("client/pages/users/profile", {
        pageTitle: "Thông tin tài khoản"
    })
}

module.exports.updateInfo = async (req, res) => {

    res.render("client/pages/users/info-update", {
        pageTitle: "Thay đổi thông tin"
    })
}

module.exports.updateInfoPatch = async (req, res) => {
    const id = req.params.id;
    await User.updateOne({
        _id: id,
        deleted: false
    }, req.body)
    req.flash("success", "Cập nhật thành công!")
    res.redirect("back");
}

module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/users/forgot-password", {
        pageTitle: "Quên mật khẩu"
    })
}

module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const existUser = await User.findOne({
        email: email,
        deleted: false,
        status: "active"
    })
    if (!existUser) {
        req.flash("error", "Email không tồn tại!");
        res.redirect("back");
        return;
    }
    // việc 1: lưu email và mã OTP vào database
    const existEmailInForgotPassword = await ForgotPassword.findOne({
        email: email
    })
    if (!existEmailInForgotPassword) {
        const otp = generateHelper.generateRandomNumber(6);
        const data = {
            email: email,
            otp: otp,
            expireAt: Date.now() + 5 * 60 * 1000
        }
        const record = await ForgotPassword(data)
        await record.save()
        // việc 2: gửi mã otp qua email cho user
        const subject = "Xác thực mã OTP";
        const text = `Mã xác thực của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong vòng 5 phút, vui lòng không cung cấp mã OTP cho bất kỳ ai.`;
        sendMailHelper.sendMail(email, subject, text);
    }
    // việc 2: gửi mã otp qua email cho user
    res.redirect(`/user/password/otp?email=${email}`);

}
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email
    res.render("client/pages/users/opt-password", {
        pageTitle: "Xác thực OTP",
        email: email
    })
}

module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email
    const otp = req.body.otp

    const existRecord = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })
    if (!existRecord) {
        req.flash("error", "Mã OTP không hợp lệ!");
        res.redirect("back");
        return;
    }
    const user = await User.findOne({
        email: email
    })
    res.cookie("tokenUser", user.token)
    res.redirect("/user/password/reset");

}

module.exports.reset = async (req, res) => {
    res.render("client/pages/users/reset-password", {
        pageTitle: "Đổi mật khẩu"
    })
}

module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne({
        token: tokenUser,
        status: "active",
        deleted: false
    }, {
        password: md5(password)
    })
    req.flash("success", "Đổi mật khẩu thành công!");
    res.redirect("/");
}