const fs = require('fs');
const path = require('path');
const generate = require('nanoid/generate');

const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Option = require('../models/option.model');

module.exports.postCreate = async function(req, res, next) {
	req.body.image = req.files.map(file => file.path.split('/').slice(1).join('/'));
	const category = await Category.findOne({categoryName: req.body.categories});
	if(!category) await Category.create({ categoryName: req.body.categories });
	const { size, color } = req.body;
	const product = await Product.create(req.body);
	const option = size.reduce((arr, size) => {
		return arr.concat(
			color.map(color => {
				return {
					product: product._id,
					color: color,
					size: size
				}
			})
		);
	}, []);
	await Option.insertMany(option);
	return res.send(true);
}

module.exports.deleteProduct = async function(req, res, next) {
	const product = await Product.findById(req.params.id);
	for(image of product.image) {
		try {
			fs.unlinkSync(path.join(__dirname, `../public/${image}`));
		} catch {
			continue;
		}
	}
	await Product.deleteOne({_id: req.params.id});
	const products = await Product.find();
	// const products = await Product.bulkWrite([
	// 	{
	// 		deleteOne: {
	// 			filter: {_id: req.params.id}
	// 		}
	// 	},
	// 	{
	// 		find: {}
	// 	}
	// ])
	// debugger;
	res.json(products);
}

module.exports.editProduct = async function(req, res, next) {
	let product = await Product.findById(req.params.id); // find current product
	const oldFiles = JSON.parse(req.body.oldFiles).map(({name}) => `img/uploads/${name}`); // remaining images
	const newFiles = req.files.map(file => file.path.split('/').slice(1).join('/')); // new images
	const newInfo = req.body;
	debugger;
	const removedFiles = product.image.filter(image => { // find removed images
		return oldFiles.findIndex(file => file === image) === -1;
	})
	for(file of removedFiles) { // remove image actually
		try {
			fs.unlinkSync(path.join(__dirname, `../public/${file}`));
		} catch {
			continue;
		}
	}
	delete newInfo['oldFiles']; // del req.body's oldFiles property
	const updatedImageArray = [...oldFiles, ...newFiles];
	product = Object.assign(product, {...newInfo, image: updatedImageArray});
	product.save();
	return res.send(true);
}