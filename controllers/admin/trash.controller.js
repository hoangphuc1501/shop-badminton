module.exports.index = async (req, res) => {
    
    res.render("admin/pages/trash/index.pug",{
        pageTitle: "Trang thùng rác"
    });
}
