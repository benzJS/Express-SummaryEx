const User = require('../models/user.model');
const Product = require('../models/product.model');
const Session = require('../models/session.model');

module.exports = async function(req, res, next) {
    if(req.path === '/dashboard') {
        console.log('next');
        return next();
    }
	let user, cart;
    function priceAnal(price) {
        return price === 0 ? price 
        : price.toString().substring(0, price.toString().length - 3).concat('.', price.toString().substring(price.toString().length - 3));
    }
    const products = await Product.find();
    if(req.signedCookies.userId) {
        user = await User.findById(req.signedCookies.userId);
        cart = user.cart.map(id => products.find(product => product.id === id));
        res.locals = {...res.locals, user: user, cart: cart, priceAnal: priceAnal};
        return next();
    }

    const session = req.signedCookies.sessionId ? await Session.findById(req.signedCookies.sessionId)
    : await Session.create({cart: []});
    res.cookie('sessionId', session._id, { signed: true });
    cart = session.cart.map(id => products.find(product => product.id === id));
    res.locals = {...res.locals, session: session, cart: cart, priceAnal: priceAnal};
    // debugger;
    next();
}