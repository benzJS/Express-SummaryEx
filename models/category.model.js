const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
	categoryName: {
		type: String,
		requried: true,
		lowercase: true
	}
})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;