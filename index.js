const express = require("express");
require('dotenv').config(); 
const systemConfig = require("./config/system");
const app = express();
const port = process.env.PORT;

const database = require("./config/database");
database.connect();


const routeAdmin = require("./routes/admin/index.route");
const routeClient = require("./routes/client/index.route");

app.set('views', './views'); //Tìm đến thư mục tên là view
app.set('view engine', 'pug')// template engine sử dụng là pug
app.use(express.static('public'))// thiết lập thư mục chứa file tĩnh

app.locals.prefigAdmin = systemConfig.prefigAdmin

// khai báo route
routeAdmin(app);
routeClient(app);



app.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
});