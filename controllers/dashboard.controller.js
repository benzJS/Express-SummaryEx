const User = require('../models/user.model');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Order = require('../models/order.model');
const mongoose = require('mongoose');

module.exports.redirect = function(req, res, next) {
	res.redirect('/dashboard/table');
}

module.exports.table = async function(req, res, next) {
	if(req.signedCookies.adminId) {
		const user = await User.findById(req.signedCookies.adminId);
		const products = await Product.find();
		const categories = await Category.find();
		res.locals = {
			...res.locals,
			adminUser: user,
			products: products,
			categories: categories
		}
	}
	res.render('table');
}

module.exports.orders = async function(req, res, next) {
	const user = await User.findById(req.signedCookies.adminId);
	const orders = await Order.find({ state: -1 });
	const orderWithUserData = await Promise.all(orders.map(async order => {
		const user = await User.aggregate([
			{ $match: {_id: mongoose.Types.ObjectId(order.userId)} },
			{ $project: { _id: 0, fullname: 1 } }
		]);
		return {
			...order._doc,
			client: user[0]
		}
	}));
	res.locals = {
		...res.locals,
		adminUser: user,
		orders: orderWithUserData
	}
	res.render('orders');	
}

module.exports.signin = async function(req, res, next) {
	const user = await User.findOne({email: req.body.email});
	if(!user || user.role !== 'admin') {
		return res.send(false);
	}
	res.cookie('adminId', user._id, { signed: true });
	res.redirect('/dashboard');
}

module.exports.fbPost = async function(req, res, next) {
	let user = await User.findOne({fbID: req.body.userID});
	if(!user) {
		user = await User.create({fbID: req.body.userID, cart: [], fullname: 'Facebook User', role: 'mem'})
	}
	res.cookie('adminId', user._id, { signed: true });
	res.send(true);
}

module.exports.signout = function(req, res, next) {
	res.clearCookie('adminId');
	res.redirect('/dashboard');
}