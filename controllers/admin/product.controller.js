const Products = require("../../models/product.model");
module.exports.index = async (req, res) => {
    const products = await Products.find({
        deleted: false
    })
    console.log(products)
    res.render("admin/pages/products/index.pug",{
        title: "Trang danh sách sản phẩm",
        products: products
    });
}