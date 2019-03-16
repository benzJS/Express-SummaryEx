const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Option = require('../models/option.model');

module.exports.auth = async function(req, res, next) {
	const user = await User.findById(req.signedCookies.userId);
    const cart = await Object.keys(user.cart).reduce(async (acc, key) => {
        const option = await Option.findById(key).populate('product', 'name price image');
        acc[key] = {
            ...option._doc,
            quantity: user.cart[key]
        }
        return acc;
    }, {});

	res.locals = {...res.locals, cart: cart};
	return res.render('checkout-info');
}

module.exports.submit = async function(req, res, next) {
    let user = await User.findById(req.signedCookies.userId);
    if(Object.keys(user.cart).length > 0) {
        await Order.create({
            user: user.id,
            summary: {...user.cart},
            state: -1
        });
        user.cart = {};
        user.save();
    }
    res.render('checkout-success');
}