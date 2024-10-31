const Contact = require("../../models/contact");
const contactMailHelper = require("../../helpers/sendMail.helper");
module.exports.index = async (req, res) => {

    res.render("client/pages/contact/index", {
        pageTitle: "Liên hệ"
    })
}

module.exports.contactPost = async (req, res) => {
    const contact = req.body
    const dataContact = {
        fullName: contact.fullName,
        email: contact.email,
        phone: contact.phone,
        content: contact.content
    };
    const subject = 'Thông tin liên hệ mới';
    const text = `Họ tên: ${dataContact.fullName}\nEmail: ${dataContact.email}\nSố điện thoại: ${dataContact.phone}\nNội dung: ${dataContact.content}`
    contactMailHelper.contactMail(contact.email, subject, text);
    const newContact = new Contact(dataContact);
    await newContact.save();
    req.flash("success", "Gửi thông tin liên hệ thành công!");
    res.redirect("back");
}