const mongoose  = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const blogSchema = new mongoose.Schema({
    title: String,
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    category_id: String,
    author: String,
    content: String,
    thumbnail: String,
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

const Blog = mongoose.model(
    'Blog',blogSchema, 'blogs'
);

module.exports = Blog;