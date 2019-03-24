const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User'
	},
	summary: {},
	state: {
		type: Number,
		min: -1,
		max: 1
	},
	date: String
}, { minimize: false });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;