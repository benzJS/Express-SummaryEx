const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Option = require('../models/option.model');

module.exports.auth = async function(req, res, next) {
	const user = await User.findById(req.signedCookies.userId);
	const products = await Product.find();
	// const cart = Object.keys(user.cart).reduce((accumulator, key) => {
 //        const productId = key.split('-')[0];
 //        const optionId = key.split('-')[1];
 //        const product = products.find(({id}) => id === productId);
 //        accumulator[key] = {
 //            ...product._doc,
 //            size: product.option.find(({id}) => id === optionId).size,
 //            color: product.option.find(({id}) => id === optionId).color,
 //            quantity: user.cart[key]
 //        }
 //        return accumulator;
 //    }, {});
    const cart = await Promise.all(user.cart.map(async ({product, quantity}) => {
        const option = await Option.findById(product).populate('product', 'name price image');
        return {...option._doc, quantity: quantity};
    }));

	res.locals = {...res.locals, cart: cart};
	return res.render('checkout-info');
}

module.exports.submit = async function(req, res, next) {
    let user = await User.findById(req.signedCookies.userId);
    if(user.cart.length > 0) {
        await Order.create({
            user: user.id,
            summary: [...user.cart],
            state: -1
        });
        user.cart = [];
        user.save();
    }
    res.render('checkout-success');
}