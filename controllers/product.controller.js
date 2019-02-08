const Product = require('../models/product.model');

module.exports.index = async function (req, res, next) {
    let products = await Product.find()
    // console.log(products[0].badge);
    res.render('products', { 
        products: products,
        categories: req.baseUrl
    });
}