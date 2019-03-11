const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');

module.exports.auth = async function(req, res, next) {
	if(!req.signedCookies.userId) {
	 return res.render('checkout-auth');
	}
	const user = await User.findById(req.signedCookies.userId);
	const products = await Product.find();
	const cart = user.cart.map(cartItem => {
	    const product = products.find(product => product.id === cartItem.id);
	    if(product) {
	        return {
	            ...product._doc,
	            size: cartItem.size,
	            color: cartItem.color
	        }
	    }
	});
	res.locals = {...res.locals, cart: cart};
	return res.render('checkout-info');
}

module.exports.confirm = async function(req, res, next) {

}