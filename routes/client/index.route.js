const productsRoute = require("./product.route");
const homeRoute = require("./home.route");

module.exports = (app) =>{
    app.use("/", productsRoute);

    app.get("/products", homeRoute)
};