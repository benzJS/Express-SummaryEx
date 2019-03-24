const Order = require('../models/order.model');
const User = require('../models/user.model');
const Option = require('../models/option.model');

const moment = require('moment');

module.exports.redirect = function(req, res, next) {
	res.redirect('/user/info');
}

module.exports.info = async function(req, res, next) {
	res.render('user/info');
}

module.exports.address = async function(req, res, next) {
	res.render('user/address');
}

module.exports.orders = async function(req, res, next) {
	const { user } = res.locals;
	let orders = await Order.find({ user: user.id });
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
		return {...order._doc, id: order._id, date: moment(order.date).format('DD/MM/YYYY')};
	}));
	res.locals = {...res.locals, orders};
	res.render('user/orders');
}