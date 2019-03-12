const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {type: String, lowercase: true},
    price: Number,
    categories: {
    	type: String,
    	lowercase: true
    },
    option: Array,
    image: Array,
    badge: Array
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;