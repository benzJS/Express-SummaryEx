const Product = require('../models/product.model');

module.exports.postProduct = function(req, res, next) {
	debugger;
	req.body.image = req.files.map(file => file.path.split('/').slice(1).join('/'));
	Product.create(req.body);
	res.redirect('/dashboard');
}