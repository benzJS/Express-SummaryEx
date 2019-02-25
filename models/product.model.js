const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    categories: String,
    size: String,
    color: String
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;