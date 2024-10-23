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

module.exports.changeStatus = async (req, res) => {
    await Products.updateOne({
        _id: req.body.id
    }, {
        status: req.body.status
    })

    res.json({
        code: "success",
        message: "đổi trạng thái thành công"
    })
}

// Đổi trạng thái nhiều bản ghi
module.exports.changeMulti = async (req, res) => {
    // console.log(req.body)

    switch (req.body.status) {
        case "active":
        case "inactive":
            await Products.updateMany({
                _id: req.body.ids
            }, {
                status: req.body.status
            })
            res.json({
                code: "success",
                message: "đổi trạng thái thành công"
            })
            break;
        case "delete":
            await Products.updateMany({
                _id: req.body.ids
            },{
                deleted:true
            })
            res.json({
                code: "success",
                message: "Xóa thành công"
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
    res.json({
        code: "success",
        message: "Xóa sản phẩm thành công"
    })
}

// đổi vị trí
module.exports.changePosition = async (req, res) => {
    await Products.updateOne({
        _id: req.body.id
    },{
        position: req.body.position
    })


    res.json({
        code: "success",
        message: "Đổi vị trí thành công!"
    })
}
// hết đổi vị tri