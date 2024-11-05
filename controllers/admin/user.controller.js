const User = require("../../models/user.model");

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
    let limitItem = 10;
    let page = 1;

    if (req.query.page) {
        page = parseInt(req.query.page);
    }
    if (req.query.limit) {
        limitItem = parseInt(req.query.limit);
    }

    const skip = (page - 1) * limitItem;
    const totalUser = await User.countDocuments(find);
    const totalPage = Math.ceil(totalUser / limitItem);
    // Hết phân trang
    const records = await User
    .find(find)
    .limit(limitItem)
    .skip(skip);

    res.render("admin/pages/users/index.pug", {
        pageTitle: "Danh sách người dùng",
        records: records,
        totalPage: totalPage,
        currentPage: page,
        limitItem: limitItem
    });
}

// Đổi trạng thái
module.exports.changeStatus = async (req, res) => {
    await User.updateOne({
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
            await User.updateMany({
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
            await User.updateMany({
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
    await User.updateOne({
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