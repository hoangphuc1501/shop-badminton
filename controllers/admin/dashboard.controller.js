module.exports.index = (req, res) => {
    res.render("admin/pages/dashboard/index.pug",{
        title: "Trang tổng quan"
    });
}