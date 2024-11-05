const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
module.exports.index = async (req, res) => {
    const find = {
        status: "active",
        deleted: false
    }
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
    // Phân trang
    let limitItem = 16;
    let page = 1;

    if (req.query.page) {
        page = parseInt(req.query.page);
    }
    if (req.query.limit) {
        limitItem = parseInt(req.query.limit);
    }

    const skip = (page - 1) * limitItem;
    const totalProduct = await Product.countDocuments(find);
    const totalPage = Math.ceil(totalProduct / limitItem);
    // Hết phân trang

    const product = await Product
        .find(find)
        .limit(limitItem)
        .skip(skip)
        .sort(sort);
    for (const item of product) {
        item.priceNew = item.price * (100 - item.discountPercentage) / 100;
        item.priceNew = (item.priceNew).toFixed(0)
    }

    res.render("client/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        product: product,
        totalPage: totalPage,
        currentPage: page,
    });
}

module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    const product = await Product.findOne({
        slug: slug,
        deleted: false,
        status: "active"
    })
    if (product) {
        // Tính toán priceNew trực tiếp
        product.priceNew = product.price * (100 - product.discountPercentage) / 100;
        product.priceNew = (product.priceNew).toFixed(0)
    }

    res.render("client/pages/products/detail.pug", {
        pageTitle: product.title,
        product: product,
    })
}

module.exports.category = async (req, res) => {
    const slugCategory = req.params.slugCategory;
    const category = await ProductCategory.findOne({
        slug: slugCategory,
        deleted: false,
        status: "active"
    })

    const allCategoryChildren = [];
    const getCategoryChildren = async (parentId) => {
        const childs = await ProductCategory.find({
            parent_id: parentId,
            status: "active",
            deleted: false
        });
        for (const child of childs) {
            allCategoryChildren.push(child.id);
            await getCategoryChildren(child.id);
        }
    };
    await getCategoryChildren(category.id);

    const product = await Product.find({
        category_id: { $in: [category.id, ...allCategoryChildren] },
        status: "active",
        deleted: false
    }).sort({
        position: "desc"
    })
    for (const item of product) {
        item.priceNew = item.price * (100 - item.discountPercentage) / 100;
        item.priceNew = (item.priceNew).toFixed(0)
    }
    res.render("client/pages/products/index.pug", {
        pageTitle: category.title,
        product: product
    });
}

module.exports.search = async (req, res) => {
    // Phân trang
    find = {
        deleted: false,
        status: "active"
    }
    let limitItem = 16;
    let page = 1;

    if (req.query.page) {
        page = parseInt(req.query.page);
    }
    if (req.query.limit) {
        limitItem = parseInt(req.query.limit);
    }

    const skip = (page - 1) * limitItem;
    const totalProduct = await Product.countDocuments(find);
    const totalPage = Math.ceil(totalProduct / limitItem);
    // Hết phân trang
    const keyword = req.query.keyword;
    let product = [];
    // Tìm kiếm
    if (keyword) {
        const regex = new RegExp(keyword, "i");
        product = await Product
            .find({
                title: regex,
                deleted: false,
                status: "active"
            })
            .limit(limitItem)
            .skip(skip)
            .sort({ position: "desc" });
        for (const item of product) {
            item.priceNew = (1 - item.discountPercentage / 100) * item.price;
            item.priceNew = item.priceNew.toFixed(0);
        }
    }
    // Hết Tìm kiếm
    res.render("client/pages/products/search", {
        pageTitle: `Kết quả tìm kiếm: ${keyword}`,
        keyword: keyword,
        product: product,
        totalPage: totalPage,
        currentPage: page,
    });
}

module.exports.favorite = async (req, res) => {
    const favorite = await Product.find({
        deleted: false,
        status: "active",
        love: true
    })
    for (const item of favorite) {
        item.priceNew = (1 - item.discountPercentage / 100) * item.price;
        item.priceNew = item.priceNew.toFixed(0);
    }
    res.render("client/pages/products/favorite", {
        pageTitle: `Sản phẩm yêu thích`,
        favorite: favorite
    });
}

module.exports.changeFavorite = async (req, res) => {
    const id = req.body.id
    const love = req.body.love;
    
    await Product.updateOne({ _id: id }, { love: love });
    req.flash('success', love ? 'Thêm vào yêu thích thành công!' : 'Đã hủy yêu thích!');
    res.json({
        code: "success"
    })
}
