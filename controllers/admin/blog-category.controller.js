const BlogCategory = require("../../models/blog-category.model");
const Account = require("../../models/account.model");
const moment = require("moment");

const systemConfig = require("../../config/system");
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    // lọc theo trạng thái
    if (req.query.status) {
        find.status = req.query.status
    }
    // hết lộc theo trạng thái

    // tìm kiếm 
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
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
    const totalCategory = await BlogCategory.countDocuments(find);
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
    const listBlogCategory = await BlogCategory
        .find(find)
        .skip(skip)
        .limit(limitItem)
        .sort(sort)

        for (const item of listBlogCategory) {
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

    res.render("admin/pages/blogs-category/index.pug", {
        pageTitle: "Danh mục bài viết",
        listBlogCategory: listBlogCategory,
        totalPage: totalPage,
        currentPage: page,
        limitItem: limitItem
    });
}

module.exports.create = async (req, res) => {
    const listBlogCategory = await BlogCategory.find({
        deleted: false,
    })

    res.render("admin/pages/blogs-category/create.pug", {
        pageTitle: "Thêm danh mục bài viết",
        listBlogCategory: listBlogCategory
    });
}

module.exports.createPost = async (req, res) => {
    req.body.createdBy = res.locals.user.id;
    req.body.createdAt = new Date();
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const countRecord = await BlogCategory.countDocuments();
        req.body.position = countRecord + 1;
    }
    const record = new BlogCategory(req.body);
    await record.save();
    req.flash("success", "Thêm danh mục thành công!")
    res.redirect(`/${systemConfig.prefixAdmin}/blogs-category`);
}


module.exports.edit = async (req, res) => {
    const id = req.params.id
    const category = await BlogCategory.findOne({
        _id: id,
        deleted: false
    })
    const listBlogCategory = await BlogCategory.find({
        deleted: false,
    })

    res.render("admin/pages/blogs-category/edit.pug", {
        pageTitle: "Chỉnh sửa danh mục bài viết",
        listBlogCategory: listBlogCategory,
        category: category
    });
}

module.exports.editPatch = async (req, res) => {
    req.body.updatedBy = res.locals.user.id;
    req.body.updatedAt = new Date();
    const id = req.params.id
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        delete req.body.position;
    }
    await BlogCategory.updateOne({
        _id: id,
        deleted: false
    }, req.body)

    req.flash("success", "Cập nhật thành công!");
    res.redirect("back");
}

module.exports.delete = async (req, res) => {
    await BlogCategory.updateOne({
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

// Đổi trạng thái
module.exports.changeStatus = async (req, res) => {
    await BlogCategory.updateOne({
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
            await BlogCategory.updateMany({
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
            await BlogCategory.updateMany({
                _id: req.body.ids
            }, {
                deleted: true,
                deletedBy: res.locals.user.id,
                deletedAt: new Date()
            })
            req.flash('success', 'Xóa Danh mục thành công!');
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

// đổi vị trí
module.exports.changePosition = async (req, res) => {
    await BlogCategory.updateOne({
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