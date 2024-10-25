const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    const product =  await Product
    .find({
        status: "active",
        deleted:false
    })
    .sort({
        position: "desc"
    });
    for (const item of product) {
        item.priceNew = item.price*(100-item.discountPercentage)/100;
        item.priceNew = (item.priceNew).toFixed(0)
    } 

    res.render("client/pages/products/index.pug",{
        pageTitle: "Trang danh sách sản phẩm",
        product: product
    });
}

module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    const product = await Product.findOne({
        slug: slug,
        deleted: false,
        status: "active"
    })
    const toLocaleString = (price) => price.toLocaleString('vi-VN');
    if (product) {
        // Tính toán priceNew trực tiếp
        product.priceNew = product.price * (100 - product.discountPercentage) / 100;
        product.priceNew = toLocaleString(parseFloat(product.priceNew).toFixed(0)); // Định dạng trước khi gửi đi
    }

    res.render("client/pages/products/detail.pug", {
        pageTitle: product.title,
        product: product,
        toLocaleString: toLocaleString
    })
}