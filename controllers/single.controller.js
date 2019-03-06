const Product = require('../models/product.model');

module.exports.index = async function (req, res, next) {
    const products = await Product.find();
    debugger;
	res.render('single', { products: products, id: req.params.id }); 
}