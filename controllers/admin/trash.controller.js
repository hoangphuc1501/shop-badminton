const ProductCategory = require("../../models/product-category.model");
const Products = require("../../models/product.model");
const Blog = require("../../models/blog.model");
const BlogCategory = require("../../models/blog-category.model");
const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");
const Contact = require("../../models/contact");
const moment = require("moment");
module.exports.productCategory = async (req, res) => {
    const ListProductCategory = await ProductCategory.find({
        deleted: true
    })
    for (const item of ListProductCategory) {
        // Thêm bởi
        const infoCreate = await Account.findOne({
            _id:  item.createdBy
        })
        if(infoCreate){
            item.deletedByFullName = infoCreate.fullName;
        }else{
            item.deletedByFullName = "";
        }

        if(item.deletedAt){
            item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YY");
        }

    }
    res.render("admin/pages/trash/products-category.pug", {
        pageTitle: "Thùng rác",
        ListProductCategory: ListProductCategory
    });
}

module.exports.product = async (req, res) => {
    const products = await Products.find({
        deleted: true
    })
    for (const item of products) {
        // Thêm bởi
        const infoCreate = await Account.findOne({
            _id:  item.createdBy
        })
        if(infoCreate){
            item.deletedByFullName = infoCreate.fullName;
        }else{
            item.deletedByFullName = "";
        }

        if(item.deletedAt){
            item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YY");
        }

    }
    res.render("admin/pages/trash/product.pug", {
        pageTitle: "Thùng rác",
        products: products
    });
}
module.exports.blogs = async (req, res) => {
    const blogs = await Blog.find({
        deleted: true
    })
    for (const item of blogs) {
        // Thêm bởi
        const infoCreate = await Account.findOne({
            _id:  item.createdBy
        })
        if(infoCreate){
            item.deletedByFullName = infoCreate.fullName;
        }else{
            item.deletedByFullName = "";
        }

        if(item.deletedAt){
            item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YY");
        }

    }
    res.render("admin/pages/trash/blog.pug", {
        pageTitle: "Thùng rác",
        blogs: blogs
    });
}
module.exports.blogsCategory = async (req, res) => {
    const blogsCategory = await BlogCategory.find({
        deleted: true
    })
    for (const item of blogsCategory) {
        // Thêm bởi
        const infoCreate = await Account.findOne({
            _id:  item.createdBy
        })
        if(infoCreate){
            item.deletedByFullName = infoCreate.fullName;
        }else{
            item.deletedByFullName = "";
        }

        if(item.deletedAt){
            item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YY");
        }

    }
    res.render("admin/pages/trash/blog-category.pug", {
        pageTitle: "Thùng rác",
        blogsCategory: blogsCategory
    });
}
module.exports.role = async (req, res) => {
    const roles = await Role.find({
        deleted: true
    })
    for (const item of roles) {
        // Thêm bởi
        const infoCreate = await Account.findOne({
            _id:  item.createdBy
        })
        if(infoCreate){
            item.deletedByFullName = infoCreate.fullName;
        }else{
            item.deletedByFullName = "";
        }

        if(item.deletedAt){
            item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YY");
        }

    }
    res.render("admin/pages/trash/role.pug", {
        pageTitle: "Thùng rác",
        roles: roles
    });
}
module.exports.account = async (req, res) => {
    const accounts = await Account.find({
        deleted: true
    })
    for (const item of accounts) {
        const role = await Role.findOne({
            _id: item.role_id,
            deleted: false
        });
        item.role_title = role.title;
    }
    for (const item of accounts) {
        // Thêm bởi
        const infoCreate = await Account.findOne({
            _id:  item.createdBy
        })
        if(infoCreate){
            item.deletedByFullName = infoCreate.fullName;
        }else{
            item.deletedByFullName = "";
        }

        if(item.deletedAt){
            item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YY");
        }

    }
    res.render("admin/pages/trash/account.pug", {
        pageTitle: "Thùng rác",
        accounts: accounts
    });
}
module.exports.user = async (req, res) => {
    const users = await User.find({
        deleted: true
    })
    res.render("admin/pages/trash/user.pug", {
        pageTitle: "Thùng rác",
        users: users
    });
}
module.exports.contact = async (req, res) => {
    const contacts = await Contact.find({
        deleted: true
    })
    res.render("admin/pages/trash/contact.pug", {
        pageTitle: "Thùng rác",
        contacts: contacts
    });
}

module.exports.delete = async (req, res) => {
    await ProductCategory.deleteOne({
        _id: req.body.id
    },{
        deletedBy: res.locals.user.id,
        deletedAt: new Date()
    });
    await Products.deleteOne({
        _id: req.body.id
    },{
        deletedBy: res.locals.user.id,
        deletedAt: new Date()
    });
    await Blog.deleteOne({
        _id: req.body.id
    },{
        deletedBy: res.locals.user.id,
        deletedAt: new Date()
    });
    await BlogCategory.deleteOne({
        _id: req.body.id
    },{
        deletedBy: res.locals.user.id,
        deletedAt: new Date()
    });
    await Role.deleteOne({
        _id: req.body.id
    },{
        deletedBy: res.locals.user.id,
        deletedAt: new Date()
    });
    await Account.deleteOne({
        _id: req.body.id
    },{
        deletedBy: res.locals.user.id,
        deletedAt: new Date()
    });
    await User.deleteOne({
        _id: req.body.id
    });
    await Contact.deleteOne({
        _id: req.body.id
    });
    req.flash("success", "Xóa thành công!")
    res.json({
        code: "success"
    })
}

module.exports.restore = async (req, res) => {
    await ProductCategory.updateOne({
        _id: req.body.id,
    },{
        deleted: false
    });
    await Products.updateOne({
        _id: req.body.id,
    },{
        deleted: false
    });
    await Blog.updateOne({
        _id: req.body.id,
    },{
        deleted: false
    });
    await BlogCategory.updateOne({
        _id: req.body.id,
    },{
        deleted: false
    });
    await Role.updateOne({
        _id: req.body.id,
    },{
        deleted: false
    });
    await Account.updateOne({
        _id: req.body.id,
    },{
        deleted: false
    });
    await User.updateOne({
        _id: req.body.id,
    },{
        deleted: false
    });
    await Contact.updateOne({
        _id: req.body.id,
    },{
        deleted: false
    });
    req.flash("success", "Khôi phục thành công!")
    res.json({
        code: "success"
    })
}
