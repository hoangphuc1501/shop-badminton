const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const productCategory = require("./product-category.route");
const roleRoute = require("./role.route");
const accountRoute = require("./account.route");
const authRoute = require("./auth.route");
const trashRoute = require("./trash.route");
const settingRoute = require("./setting.route");
const blogCategoryRoute = require("./blog-category.route");
const blogRoute = require("./blog.route");
const userRoute = require("./user.route");

const systemConfig = require("../../config/system");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
module.exports = (app) => {
    const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

    app.use(`${PATH_ADMIN}/dashboard`,
        authMiddleware.requireAuth,
        dashboardRoute
    );
    app.use(`${PATH_ADMIN}/products`, 
        authMiddleware.requireAuth,
        productRoute
    );
    app.use(`${PATH_ADMIN}/products-category`,
        authMiddleware.requireAuth,
        productCategory
    );
    app.use(`${PATH_ADMIN}/roles`, 
        authMiddleware.requireAuth,
        roleRoute
    );
    app.use(`${PATH_ADMIN}/accounts`,
        authMiddleware.requireAuth, 
        accountRoute
    );
    app.use(`${PATH_ADMIN}/auth`, authRoute);

    app.use(`${PATH_ADMIN}/settings`, 
        authMiddleware.requireAuth,
        settingRoute
    );
    app.use(`${PATH_ADMIN}/trash`, 
        authMiddleware.requireAuth,
        trashRoute
    );
    app.use(`${PATH_ADMIN}/blogs-category`, 
        authMiddleware.requireAuth,
        blogCategoryRoute
    );
    app.use(`${PATH_ADMIN}/blogs`, 
        authMiddleware.requireAuth,
        blogRoute
    );
    app.use(`${PATH_ADMIN}/users`, 
        authMiddleware.requireAuth,
        userRoute
    );
}

