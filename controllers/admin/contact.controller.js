const Contact = require("../../models/contact");


module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    // tìm kiếm
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.email = regex;
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
    const totalContact = await Contact.countDocuments(find);
    const totalPage = Math.ceil(totalContact / limitItem);
    // Hết phân trang
    const records = await Contact
        .find(find)
        .limit(limitItem)
        .skip(skip);
    res.render("admin/pages/contacts/index.pug", {
        pageTitle: "Danh sách liên hệ",
        records: records,
        totalPage: totalPage,
        currentPage: page,
        limitItem: limitItem
    });
}

// xóa liên hệ
module.exports.delete = async (req, res) => {
    await Contact.updateOne({
        _id: req.body.id
    }, {
        deleted: true,
    })
    req.flash('success', 'Xóa tài khoản thành công!');
    res.json({
        code: "success"
    })
}
// hết xóa liên hệ
