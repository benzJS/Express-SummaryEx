const User = require('../models/user.model');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Order = require('../models/order.model');
const Option = require('../models/option.model');

const moment = require('moment');

module.exports.redirect = function(req, res, next) {
	if(!req.signedCookies.adminId) return res.render('dashboard-signin');
	res.redirect('/dashboard/table?category=all');
}

module.exports.table = async function(req, res, next) {
	const user = await User.findById(req.signedCookies.adminId);
	const categories = await Category.find();
	const products = req.query.category !== 'all' ? await Product.find({ categories: req.query.category }) : await Product.find();
	res.locals = {
		...res.locals,
		adminUser: user,
		products,
		categories,
		categoryQ: req.query.category
	}
	res.render('table');
}

module.exports.orders = async function(req, res, next) {
	const user = await User.findById(req.signedCookies.adminId);

	// find orders by state
	if(!req.query.user) {
		var orders = await Order
			.find({ state: req.query.state })
			.populate('user');
	} else {
		var orders = await Order
			.find({ state: req.query.state, user: req.query.user })
			.populate('user');
	}

	// population
	orders = await Promise.all(orders.map(async order => {
		order.summary = await Object.keys(order.summary).reduce(async (accP, key) => {
			const option = await Option.findById(key).populate('product', 'name price');
			const acc = await accP;
			acc[key] = {
				...option._doc,
				quantity: order.summary[key]
			}
			return acc;
		}, {})
		return {...order._doc, id: order._id, date: moment(order.date).format('DD/MM/YYYY, HH:mm')};
	}));

	// render
	res.locals = {
		...res.locals,
		adminUser: user,
		orders,
		state: req.query.state
	}
	res.render('orders');
}

module.exports.users = async function(req, res, next) {
	const adminUser = await User.findById(req.signedCookies.adminId);
	let users = await User.find().nin('role', 'admin');
	users = await Promise.all(users.map(async (user) => {
		const orders = await Order.find({ user: user._id, state: 1 }).countDocuments();
		return {
			...user._doc,
			orders
		}
	}));
	res.locals = {
		...res.locals,
		adminUser,
		users
	};
	res.render('users');
}

module.exports.orderPatch = async function(req, res, next) {
	const order = await Order.findById(req.params.id);
	order.state++;
	order.save();
	return res.send(true);
}

module.exports.orderDelete = async function(req, res, next) {
	await Order.deleteOne({ _id: req.params.id });
	return res.send(true);
}

module.exports.signin = async function(req, res, next) {
	const user = await User.findOne({email: req.body.email});
	if(!user || user.role !== 'admin') {
		return res.send(false);
	}
	res.cookie('adminId', user._id, { signed: true });
	res.redirect('/dashboard');
}

module.exports.signout = function(req, res, next) {
	res.clearCookie('adminId');
	res.redirect('/dashboard');
}