const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        phone: String,
        content: String,
        status: String,
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);
const Contact = mongoose.model("Contact", contactSchema, "contacts");
module.exports = Contact; 