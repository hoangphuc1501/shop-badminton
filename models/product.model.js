const mongoose  = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productSchema = new mongoose.Schema({
    title: String,
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    category_id: String,
    love: {
        type: Boolean,
        default: false
    },
    brand: String,
    code: String,
    featured: {
        type: String,
        default: 0
    },
    description: String,
    descriptionShort: String,
    specifications: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
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

const Product = mongoose.model(
    'Product',productSchema, 'products'
);

module.exports = Product;