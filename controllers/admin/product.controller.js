const Products = require("../../models/product.model");
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };

    // lọc theo trạng thái
    if (req.query.status) {
        find.status = req.query.status;
    }
    // hết lọc theo trạng thái

    // tìm kiếm
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
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
    const totalProduct = await Products.countDocuments(find);
    const totalPage = Math.ceil(totalProduct / limitItem);
    // Hết phân trang

    const products = await Products.
    find(find)
    .limit(limitItem)
    .skip(skip)
    .sort({
        position: "desc"
    });

    const toLocaleString = (price) => price.toLocaleString('vi-VN');
    res.render("admin/pages/products/index.pug", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        totalPage: totalPage,
        currentPage: page,
        toLocaleString: toLocaleString // Truyền hàm vào template
    });
}
// Foi963 trạng thái
module.exports.changeStatus = async (req, res) => {
    await Products.updateOne({
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
            await Products.updateMany({
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
            await Products.updateMany({
                _id: req.body.ids
            },{
                deleted:true
            })
            req.flash('success', 'Xóa sản phẩm thành công!');
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

// xóa sản phẩm
module.exports.delete = async (req, res) => {
    await Products.updateOne({
        _id: req.body.id
    }, {
        deleted: true
    })
    req.flash('success', 'Xóa sản phẩm thành công!');
    res.json({
        code: "success"
    })
}

// đổi vị trí
module.exports.changePosition = async (req, res) => {
    await Products.updateOne({
        _id: req.body.id
    },{
        position: req.body.position
    })
    req.flash('success', 'Đổi vị trí thành công!');
    res.json({
        code: "success"
    })
}
// hết đổi vị tri