const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User'
	},
	summary: {},
	state: Number
}, { minimize: false });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;