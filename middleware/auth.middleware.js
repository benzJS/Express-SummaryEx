const User = require('../models/user.model');
const Product = require('../models/product.model');
const Session = require('../models/session.model');
const Category = require('../models/category.model');

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
    const categories = await Category.find();

    // if user has already signed in
    if(req.signedCookies.userId) {
        user = await User.findById(req.signedCookies.userId);

        // find cart's product data
        cart = user.cart.map(cartItem => {
            const product = products.find(product => product.id === cartItem.id);
            if(product) {
                return {
                    ...product._doc,
                    size: cartItem.size,
                    color: cartItem.color
                }
            }
        });

        res.locals = {...res.locals, user: user, cart: cart, categories: categories, priceAnal: priceAnal};
        return next();
    }

    // if not
    let session = await Session.findById(req.signedCookies.sessionId);
    if(!session) {
        session = await Session.create({cart: []});        
        res.cookie('sessionId', session._id, { signed: true });
    }

    // find cart's product data
    cart = session.cart.map(cartItem => {
        const product = products.find(product => product.id === cartItem.id);
        if(product) {
            return {
                ...product._doc,
                size: cartItem.size,
                color: cartItem.color
            }
        }
    });
    debugger;
    res.locals = {...res.locals, session: session, categories: categories, cart: cart, priceAnal: priceAnal};
    next();
}