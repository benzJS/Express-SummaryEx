const Product = require('../models/product.model');
const Option = require('../models/option.model');

module.exports.index = async function (req, res, next) {
	const single = await Product.findById(req.params.id);
    const products = await Product.find({ categories: single.categories });
    const option = await Option.find({product: single.id});
	res.render('single', { products: products, id: req.params.id, option: option, single: single }); 
}