const Products = require("../../models/product.model");
const systemConfig = require("../../config/system");
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

// Trang thêm mới
module.exports.create = (req, res) => {

    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm"
    });
}

module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position) {
        req.body.position = parseInt(req.body.position);
    }else{
        const countRecord = await Products.countDocuments();
        req.body.position = countRecord + 1
    }
    
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    const record = new Products(req.body);
    await record.save();
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
}
// hết trang thêm mới

// trang sửa sản phẩm
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const product = await Products.findOne({
        _id: id,
        deleted: false
    });
    res.render("admin/pages/products/edit", {
        pageTitle: "Chỉnh sửa sản phẩm",
        product: product
    });
}
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position) {
        req.body.position = parseInt(req.body.position);
    }
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    await Products.updateOne({
        _id:id,
        deleted: false
    }, req.body);
    req.flash("success", "Cập nhật sản phẩm thành công!");
    res.redirect("back");
}
// hết sửa sản phẩm