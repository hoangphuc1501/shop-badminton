module.exports.index = (req, res) => {
    res.render("admin/pages/accounts/index.pug",{
        title: "Danh sách tài khoản"
    });
}