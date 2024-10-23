const express = require("express");
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
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

app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// parse application/json
app.use(bodyParser.json())

// khai báo route
routeAdmin(app);
routeClient(app);

app.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
});