const Product = require("../../models/product.model");
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
    .limit(6)

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

    
    res.render("client/pages/home/index.pug",{
        pageTitle: "Trang chủ",
        productFeatured: productFeatured,
        productNew: productNew
    });
}