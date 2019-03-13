const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
	userId: String,
	summary: {},
	state: Number
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;