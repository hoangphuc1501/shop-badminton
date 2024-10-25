const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
    const records = await Role.find({
        deleted: false
    });
    res.render("admin/pages/roles/index.pug",{
        pageTitle: "Nhóm quyền",
        records: records
    });
}
module.exports.create = async (req, res) => {
    // const records = await Role.find({
    //     deleted: false
    // });
    res.render("admin/pages/roles/create.pug",{
        pageTitle: "Tạo nhóm quyền"
    });
}
module.exports.createPost = async (req, res) => {
    const role = new Role(req.body);
    await role.save();
    req.flash("success", "Tạo nhóm quyền thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}