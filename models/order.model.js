const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
	userId: String,
	summary: Array,
	state: Boolean
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;