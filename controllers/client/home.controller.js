const Product = require("../../models/product.model");
const Blog = require("../../models/blog.model");
const Account = require("../../models/account.model");
const moment = require("moment");
module.exports.index = async (req, res) => {
    // sản phẩm nổi bật
    const productFeatured = await Product
    .find({
        deleted:  false,
        status: "active",
        featured: 1
    })
    .sort({
        position: "asc"
    })
    .limit(10)

    for (const item of productFeatured) {
        item.priceNew = (1 - item.discountPercentage/100) * item.price;
        item.priceNew = item.priceNew.toFixed(0);
    }
    // hết sản phẩm nổi bật

    // sản phẩm mới
    const productNew = await Product
    .find({
        deleted:  false,
        status: "active",
    })
    .sort({
        position: "desc"
    })
    .limit(10)

    for (const item of productNew) {
        item.priceNew = (1 - item.discountPercentage/100) * item.price;
        item.priceNew = item.priceNew.toFixed(0);
    }
    // hết sản phẩm mới

    // tin tức
        const news = await Blog
        .find({
            deleted: false,
            status: "active"
        })
        .limit(4)
        for (const item of news) {
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
        }
    // hết tin tức
    res.render("client/pages/home/index.pug",{
        pageTitle: "Trang chủ",
        productFeatured: productFeatured,
        productNew: productNew,
        news: news
    });
}