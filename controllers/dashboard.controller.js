const User = require('../models/user.model');
const Product = require('../models/product.model');

module.exports.index = async function(req, res, next) {
	if(req.signedCookies.adminId) {
		const user = await User.findOne({userId: req.signedCookies.adminId});
		const products = await Product.find();
		res.locals = {
			...res.locals,
			adminUser: user,
			products: products
		}
	}
	res.render('table');
}

module.exports.postIndex = async function(req, res, next) {
	const user = await User.findOne({email: req.body.email});
	debugger;
	if(!user || user.role !== 'admin') {
		return res.send(false);
	}
	res.cookie('adminId', user._id, { signed: true });
	res.redirect('/dashboard');
}

module.exports.fbPost = async function(req, res, next) {
	console.log(req.body.userId);
	let user = await User.findOne({userId: req.body.userId});
	if(!user) {
		user = await User.create({userId: req.body.userId, cart: [], fullname: 'Facebook User', role: 'mem'})
	}
	res.cookie('adminId', user._id, { signed: true });
	res.send(true);
}

module.exports.signout = function(req, res, next) {
	res.clearCookie('adminId');
	res.redirect('/dashboard');
}