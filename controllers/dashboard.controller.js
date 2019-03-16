const User = require('../models/user.model');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Order = require('../models/order.model');
const Option = require('../models/option.model');

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
	let orders = await Order
		.find({ state: -1 })
		.populate('user');
	// orders = await Promise.all(orders.map(async order => {
	// 	order.summary = await Promise.all(order.summary.map(async ({ product, quantity }) => {
	// 		const option = await Option.findById(product).populate('product', 'name price');
	// 		return {...option._doc, quantity: quantity};
	// 	}));
	// 	return order;
	// }))
	orders = await Promise.all(orders.map(async order => {
		order.summary = await Object.keys(order.summary).reduce(async (acc, key) => {
			const option = await Option.findById(key).populate('product', 'name price');
			acc[key] = {
				...option._doc,
				quantity: order.summary[key]
			}
			return acc;
		}, {})
		return order;
	}));
	res.locals = {
		...res.locals,
		adminUser: user,
		orders: orders
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