const User = require('../models/user.model');
const Product = require('../models/product.model');

module.exports.index = async function (req, res, next) {
	// const category = req.baseUrl.split('/');
	// debugger;
    const products = await Product.find({ categories: req.params.category });
    res.render('products', { 
        products: products,
        category: req.baseUrl
    });
	debugger;
}

module.exports.single = async function(req, res, next) {
	const products = await Product.find();
	res.render('single', { products: products, id: req.params.id }); 
}