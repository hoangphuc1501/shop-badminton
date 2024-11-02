const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const BlogsCategorySchema = new mongoose.Schema({
    title: String,
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    parent_id: String,
    description: String,
    status: String,
    position: Number,
    createdBy:String,
    createdAt: Date,
    updatedBy:String,
    updatedAt: Date,
    deletedBy:String,
    deletedAt: Date,
    deleted: {
        type: Boolean,
        default: false
    }
});
const BlogCategory = mongoose.model('BlogCategory', BlogsCategorySchema, 'blogs-category');
module.exports = BlogCategory;