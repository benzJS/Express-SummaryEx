const User = require('../models/user.model');
const Product = require('../models/product.model');

module.exports.index = async function (req, res, next) {
    let products = await Product.find();
    res.render('products', { 
        products: products,
        categories: req.baseUrl
    });
}