const User = require('../models/user.model');
const Product = require('../models/product.model');

module.exports = async function(req, res, next) {
	let user, cart;
    console.log('middlewaring...');
    if(req.signedCookies.userId) {
        debugger;
        user = await User.findById(req.signedCookies.userId);
        const products = await Product.find();
        cart = user.cart.map(id => products.find(product => product.id === id));
    }
    function priceAnal(price) {
        return price === 0 ? price 
        : price.toString().substring(0, price.toString().length - 3).concat('.', price.toString().substring(price.toString().length - 3));
    }
    res.locals = {...res.locals, user: user, cart: cart, priceAnal: priceAnal};
    next();
}