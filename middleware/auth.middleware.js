const User = require('../models/user.model');
const Product = require('../models/product.model');
const Session = require('../models/session.model');
const Category = require('../models/category.model');

module.exports = async function(req, res, next) {
    function priceAnal(price) {
        return price === 0 ? price 
        : price.toString().substring(0, price.toString().length - 3).concat('.', price.toString().substring(price.toString().length - 3));
    }

    
    if(req.path === '/dashboard' || req.path === '/checkout') {
        console.log('next');
        res.locals = {...res.locals, priceAnal: priceAnal};
        return next();
    }

    let user;
    const products = await Product.find();
    const categories = await Category.find();

    // get user data
    if(req.signedCookies.userId) {
        user = await User.findById(req.signedCookies.userId);
    } else {
        user = await Session.findById(req.signedCookies.sessionId);
        if(!user) {
            user = await Session.create({cart: {}});
            res.cookie('sessionId', user._id, { signed: true });
        }
    }

    debugger;

    res.locals = {...res.locals, user: user, categories: categories, priceAnal: priceAnal};
    next();
}