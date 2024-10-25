const express = require("express");
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
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
// khai báo biến toàn cục cho pug
app.locals.prefixAdmin = systemConfig.prefixAdmin;
/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
// flash
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// khai báo route
routeAdmin(app);
routeClient(app);

app.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
});