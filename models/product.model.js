const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {type: String, lowercase: true},
    price: Number,
    categories: String,
    size: Array,
    color: Array,
    image: Array,
    badge: Array
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;