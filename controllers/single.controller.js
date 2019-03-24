const Product = require('../models/product.model');
const Option = require('../models/option.model');
const request = require('request');
const axios = require('axios');

module.exports.index = async function (req, res, next) {
	try {
		var single = await Product.findById(req.params.id);
	} catch(err) {
		return res.render('404');
	};
	if(!single) {
		return res.render('404');
	}
    const products = await Product.find({ categories: single.categories });
    const option = await Option.find({product: single.id});
    
	res.render('single', { products, id: req.params.id, option, single }); 
}