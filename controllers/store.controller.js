const Product = require('../models/product.model');

module.exports.postCreate = async function(req, res, next) {
	req.body.image = req.files.map(file => file.path.split('/').slice(1).join('/'));
	await Product.create(req.body);
	return res.send(true);
}

module.exports.deleteProduct = async function(req, res, next) {
	const productPromise =  await Product.deleteOne({_id: req.params.id});
	const products = await Product.find();
	res.send(JSON.stringify(products));
}