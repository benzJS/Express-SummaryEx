const User = require('../models/user.model');
const Product = require('../models/product.model');

module.exports = async function(req, res, next) {
	let user = null;
    let cart = null;
    if(req.signedCookies.userId) {
        user = await User.findById(req.signedCookies.userId);
        const products = await Product.find();
        cart = user.cart.map(id => products.find(product => product.id === id));
    }
    function priceDef(price) {
        return price.toString().substring(0, price.toString().length - 3) + '.' +  price.toString().substring(price.toString().length - 3);
    }
    res.locals = {...res.locals, user: user, cart: cart, priceAnal: priceDef};
    next();
}