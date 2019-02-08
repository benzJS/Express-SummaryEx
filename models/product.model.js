const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    categories: String,
    image: Array,
    badge: Array
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;