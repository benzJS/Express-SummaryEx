const User = require('../models/user.model');
const Product = require('../models/product.model');

module.exports.index = async function (req, res, next) {
    let products = await Product.find();
    let user = null;
    let cart = null;
    function priceDef(price) {
        return price.toString().substring(0, price.toString().length - 3) + '.' +  price.toString().substring(price.toString().length - 3);
    }
    if(req.signedCookies.userId) {
        try {
            user = await User.findById(req.signedCookies.userId);
            cart = products.filter(product => user.cart.indexOf(product._id) !== -1);
        }
        catch(err) {
            console.log(err);
        }
    }
    res.render('products', { 
        products: products,
        categories: req.baseUrl,
        priceAnal: priceDef,
        user: user,
        cart: cart
    });
}