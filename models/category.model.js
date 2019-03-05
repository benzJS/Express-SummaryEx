const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
	categoryName: String 
})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;