const User = require('../models/user.model');
const Product = require('../models/product.model');
const Session = require('../models/session.model');

module.exports = async function(req, res, next) {
    function priceAnal(price) {
        return price === 0 ? price 
        : price.toString().substring(0, price.toString().length - 3).concat('.', price.toString().substring(price.toString().length - 3));
    }
    if(req.path === '/dashboard') {
        console.log('next');
        res.locals = {...res.locals, priceAnal: priceAnal}
        return next();
    }
    let user, cart;
    const products = await Product.find();
    if(req.signedCookies.userId) {
        user = await User.findById(req.signedCookies.userId);
        // debugger;
        cart = user.cart.map(cartItem => Object.assign({}, {...products.find(product => product.id === cartItem.id)._doc,
            size: cartItem.size,
            color: cartItem.color
        })); // 
        res.locals = {...res.locals, user: user, cart: cart, priceAnal: priceAnal};
        return next();
    }
    let session = await Session.findById(req.signedCookies.sessionId);
    if(!session) {
        session = await Session.create({cart: []});        
        res.cookie('sessionId', session._id, { signed: true });
    }
    cart = session.cart.map(cartItem => {
        const product = products.find(product => product.id === cartItem.id);
        if(product) {
            return Object.assign({}, {
                ...product._doc,
                size: cartItem.size,
                color: cartItem.color
            })
        }
    });
    
    res.locals = {...res.locals, session: session, cart: cart, priceAnal: priceAnal};
    next();
}