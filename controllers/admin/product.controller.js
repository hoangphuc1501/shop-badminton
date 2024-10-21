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
    if(req.query.keyword){
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    // hết tìm kiếm

    const products = await Products.find(find);

    const toLocaleString = (price) => price.toLocaleString('vi-VN');
    res.render("admin/pages/products/index.pug", {
        title: "Trang danh sách sản phẩm",
        products: products,
        toLocaleString: toLocaleString // Truyền hàm vào template
    });
}