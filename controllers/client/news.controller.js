const Blog = require("../../models/blog.model");
const Account = require("../../models/account.model");
const moment = require("moment");

module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
        status: "active"
    }
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
    const totablog = await Blog.countDocuments(find);
    const totalPage = Math.ceil(totablog / limitItem);
    // Hết phân trang
    const news = await Blog
    .find(find)
    .limit(limitItem)
    .skip(skip)
    for (const item of news) {
        // Thêm bởi
        const infoCreate = await Account.findOne({
            _id: item.createdBy
        })
        if (infoCreate) {
            item.createdByFullName = infoCreate.fullName;
        } else {
            item.createdByFullName = "";
        }

        if (item.createdAt) {
            item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YY");
        }
    }
    res.render("client/pages/news/index", {
        pageTitle: "Tin tức",
        news: news,
        totalPage: totalPage,
        currentPage: page,
    })
}

module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    const news = await Blog.findOne({
        slug: slug,
        deleted: false,
        status: "active"
    })
        // Thêm bởi
        if (news.createdAt) {
            news.createdAtFormat = moment(news.createdAt).format("HH:mm - DD-MM-YYYY");
        }
    res.render("client/pages/news/detail", {
        pageTitle: news.title,
        news: news
    })
}