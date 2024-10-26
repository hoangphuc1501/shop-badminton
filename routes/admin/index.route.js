const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const productCategory = require("./product-category.route");
const roleRoute = require("./role.route");
const accountRoute = require("./account.route");
const authRoute = require("./auth.route");
const trashRoute = require("./trash.route");

const systemConfig = require("../../config/system");
module.exports = (app) => {
    const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

    app.use(`${PATH_ADMIN}/dashboard`, dashboardRoute);
    app.use(`${PATH_ADMIN}/products`, productRoute);
    app.use(`${PATH_ADMIN}/products-category`, productCategory);
    app.use(`${PATH_ADMIN}/roles`, roleRoute);
    app.use(`${PATH_ADMIN}/accounts`, accountRoute);
    app.use(`${PATH_ADMIN}/auth`, authRoute);


    app.use(`${PATH_ADMIN}/trash`, trashRoute);
    
}

