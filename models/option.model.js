const mongoose = require('mongoose');

const optionSchema = mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product'
	},
	size: String,
	color: String
});

const Option = mongoose.model('Option', optionSchema);

module.exports = Option;