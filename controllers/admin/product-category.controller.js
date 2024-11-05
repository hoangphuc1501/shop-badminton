const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const moment = require("moment");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
    const find = {
        deleted:false
    }
    // lọc theo trạng thái
    if (req.query.status) {
        find.status = req.query.status;
    }
    // hết lọc theo trạng thái
    // tìm kiếm
    if(req.query.keyword){
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    // hết tìm kiếm
    // Phân trang
    let limitItem = 15;
    let page = 1;

    if (req.query.page) {
        page = parseInt(req.query.page);
    }
    if (req.query.limit) {
        limitItem = parseInt(req.query.limit);
    }

    const skip = (page - 1) * limitItem;
    const totalCategory = await ProductCategory.countDocuments(find);
    const totalPage = Math.ceil(totalCategory / limitItem);
    // Hết phân trang
    //sắp xếp
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[sortKey] = sortValue;
    } else {
        sort["position"] = "desc";
    }
    // hết sắp xếp

    const listCategory = await ProductCategory
    .find(find)
    .limit(limitItem)
    .skip(skip)
    .sort(sort);

    for (const item of listCategory) {
        // Thêm bởi
        const infoCreate = await Account.findOne({
            _id:  item.createdBy
        })
        if(infoCreate){
            item.createdByFullName = infoCreate.fullName;
        }else{
            item.createdByFullName = "";
        }

        if(item.createdAt){
            item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YY");
        }

        // Cập nhật bởi
        const infoUpdate = await Account.findOne({
            _id: item.updatedBy
        })
        if(infoUpdate){
            item.updatedByFullName = infoUpdate.fullName;
        }else{
            item.updatedByFullName = "";
        }

        if(item.updatedAt){
            item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YY");
        }
    }
    res.render("admin/pages/categories/index.pug", {
        pageTitle: "Danh sách danh mục sản phẩm",
        listCategory: listCategory,
        totalPage: totalPage,
        currentPage: page,
        limitItem: limitItem
    });
}
// Đổi trạng thái
module.exports.changeStatus = async (req, res) => {
    await ProductCategory.updateOne({
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
            await ProductCategory.updateMany({
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
            await ProductCategory.updateMany({
                _id: req.body.ids
            }, {
                deleted: true,
                deletedBy: res.locals.user.id,
                deletedAt: new Date()
            })
            req.flash('success', 'Xóa danh mục thành công!');
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
    await ProductCategory.updateOne({
        _id: req.body.id
    }, {
        deleted: true,
        deletedBy: res.locals.user.id,
        deletedAt: new Date()
    })
    req.flash('success', 'Xóa danh mục thành công!');
    res.json({
        code: "success"
    })
}
// hết xóa sản phẩm
// đổi vị trí
module.exports.changePosition = async (req, res) => {
    await ProductCategory.updateOne({
        _id: req.body.id
    }, {
        position: req.body.position
    })
    req.flash('success', 'Đổi vị trí thành công!');
    res.json({
        code: "success"
    })
}
// hết đổi vị tri
// Thêm danh mục
module.exports.create = async (req, res) => {
    const listCategory = await ProductCategory.find({
        deleted:false
    })
    res.render("admin/pages/categories/create.pug", {
        pageTitle: "Thêm mới danh mục sản phẩm",
        listCategory: listCategory
    });
}

module.exports.createPost = async (req, res) => {
    req.body.createdBy = res.locals.user.id;
    req.body.createdAt = new Date();
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const countRecord = await ProductCategory.countDocuments();
        req.body.position = countRecord + 1;
    }
    const record = new ProductCategory(req.body);
    await record.save();
    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
}
// hết thêm danh mục
module.exports.edit = async (req, res) => {
    const id = req.params.id
    const listCategory = await ProductCategory.find({
        deleted:false
    })
    const category = await ProductCategory.findOne({
        _id: id,
        deleted:false
    })
    res.render("admin/pages/categories/edit.pug", {
        pageTitle: "Chỉnh sửa danh mục sản phẩm",
        listCategory: listCategory,
        category: category
    });
}

module.exports.editPatch = async (req, res) => {
    req.body.updatedBy = res.locals.user.id;
    req.body.updatedAt = new Date();
    const id = req.params.id
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    }else{
        delete req.body.position;
    }
    await ProductCategory.updateOne({
        _id: id,
        deleted:false
    }, req.body)

    req.flash("success", "Cập nhật thành công!");
    res.redirect("back");

}

