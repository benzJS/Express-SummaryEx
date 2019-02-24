const User = require('../models/user.model');
const Product = require('../models/product.model');

module.exports.index = async function (req, res, next) {
    const products = await Product.find();
    res.render('products', { 
        products: products,
        categories: req.baseUrl
    });
}

module.exports.single = async function(req, res, next) {
	const products = await Product.find();
	res.render('single', { products: products, id: req.params.id }); 
}