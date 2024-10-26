const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require('md5');

const generateHelper = require("../../helpers/generate.helper");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    // lọc theo trạng thái
    if (req.query.status) {
        find.status = req.query.status;
    }
    // hết lọc theo trạng thái
    // tìm kiếm
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.fullName = regex;
    }
    // hết tìm kiếm
    // Phân trang
    let limitItem = 4;
    let page = 1;

    if (req.query.page) {
        page = parseInt(req.query.page);
    }
    if (req.query.limit) {
        limitItem = parseInt(req.query.limit);
    }

    const skip = (page - 1) * limitItem;
    const totalAccount = await Account.countDocuments(find);
    const totalPage = Math.ceil(totalAccount / limitItem);
    // Hết phân trang
    const records = await Account
        .find(find)
        .limit(limitItem)
        .skip(skip);
    for (const item of records) {
        const role = await Role.findOne({
            _id: item.role_id,
            deleted: false
        });
        item.role_title = role.title;
    }
    res.render("admin/pages/accounts/index.pug", {
        pageTitle: "Danh sách tài khoản",
        records: records,
        totalPage: totalPage,
        currentPage: page,
        limitItem: limitItem
    });
}
// Đổi trạng thái
module.exports.changeStatus = async (req, res) => {
    await Account.updateOne({
        _id: req.body.id
    }, {
        status: req.body.status
    })
    req.flash('success', 'Thay đổi trạng thái thành công!');
    res.json({
        code: "success"
    })
}
// hết đổi trạng thái
// Đổi trạng thái nhiều bản ghi
module.exports.changeMulti = async (req, res) => {
    switch (req.body.status) {
        case "active":
        case "inactive":
            await Account.updateMany({
                _id: req.body.ids
            }, {
                status: req.body.status
            })
            req.flash('success', 'Thay đổi trạng thái thành công!');
            res.json({
                code: "success"
            })
            break;
        case "delete":
            await Account.updateMany({
                _id: req.body.ids
            }, {
                deleted: true,
            })
            req.flash('success', 'Xóa tài khoản thành công!');
            res.json({
                code: "success"
            })
            break;
        default:
            res.json({
                code: "error",
                message: "Trạng thái không hợp lệ"
            })
            break;
    }
}
// hết đổi trạng thái nhiều bản ghi
// xóa sản phẩm
module.exports.delete = async (req, res) => {
    await Account.updateOne({
        _id: req.body.id
    }, {
        deleted: true,
    })
    req.flash('success', 'Xóa tài khoản thành công!');
    res.json({
        code: "success"
    })
}
// hết xóa sản phẩm
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    });
    res.render("admin/pages/accounts/create.pug", {
        pageTitle: "Tạo tài khoản",
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

module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const roles = await Role.find({
        deleted: false
    });
    const account = await Account.findOne({
        _id: id,
        deleted: false
    })
    res.render("admin/pages/accounts/edit.pug", {
        pageTitle: "Chỉnh sửa tài khoản",
        roles: roles,
        account: account
    });
}
module.exports.editPatch = async (req, res) => {
    const id = req.params.id

    await Account.updateOne({
        _id: id,
        deleted: false
    }, req.body)

    req.flash("success", "Cập nhật thành công!")
    res.redirect("back");
}

module.exports.changePassword = async (req, res) => {
    const account = await Account.findOne({
        _id: req.params.id,
        deleted: false
    })

    res.render("admin/pages/accounts/change-password.pug", {
        pageTitle: "Đổi mật khẩu",
        account: account
    });
}

module.exports.changePasswordPatch = async (req, res) => {
    await Account.updateOne({
        _id: req.params.id,
        deleted: false
    }, {
        password: md5(req.body.password)
    });
    req.flash("success", "Đổi mật khẩu thành công!");
    res.redirect("back");
}

module.exports.myProfile = async (req, res) => {
    res.render("admin/pages/accounts/profile.pug", {
        pageTitle: "Thông tin tài khoản"
    });
}