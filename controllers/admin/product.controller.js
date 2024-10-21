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

    // Phân trang
    let limitItem = 4;
    let page = 1;

    if(req.query.page){
        page = parseInt(req.query.page);
    }
    if(req.query.limit){
        limitItem = parseInt(req.query.limit);
    }

    const skip = (page - 1) * limitItem;
    const totalProduct = await Products.countDocuments(find);
    const totalPage = Math.ceil(totalProduct/limitItem);
    // Hết phân trang

    const products = await Products.find(find).limit(limitItem).skip(skip);

    const toLocaleString = (price) => price.toLocaleString('vi-VN');
    res.render("admin/pages/products/index.pug", {
        title: "Trang danh sách sản phẩm",
        products: products,
        totalPage: totalPage,
        currentPage: page,
        toLocaleString: toLocaleString // Truyền hàm vào template
    });
}

module.exports.changeStatus = async (req, res) =>{

    await Products.updateOne({
        _id: req.body.id
    },{
        status: req.body.status
    })

    res.json({
        code: "success",
        message: "đổi trạng thái thành công"
    })
}