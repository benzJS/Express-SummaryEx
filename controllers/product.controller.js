const Product = require('../models/product.model');

module.exports.index = async function (req, res, next) {
    let products = await Product.find()
    function priceDef(price) {
        return price.toString().substring(0, price.toString().length - 3) + '.' +  price.toString().substring(price.toString().length - 3);
    }
    res.render('products', { 
        products: products,
        categories: req.baseUrl,
        priceAnal: priceDef
    });
}