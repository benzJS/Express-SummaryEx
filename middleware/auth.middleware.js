const User = require('../models/user.model');
const Product = require('../models/product.model');
const Session = require('../models/session.model');
const Category = require('../models/category.model');

module.exports = async function(req, res, next) {
    if(req.path === '/dashboard' || req.path === '/checkout' || req.path === '/auth' || req.path === '/webhook') {
        console.log('next');
        return next();
    }

    let user;
    const products = await Product.find();
    const categories = await Category.find();

    // get user's data
    if(req.signedCookies.userId) {
        user = await User.findById(req.signedCookies.userId);
    } else {
        user = await Session.findById(req.signedCookies.sessionId);
        if(!user) {
            user = await Session.create({cart: {}});
            res.cookie('sessionId', user._id, { signed: true });
        }
    }

    res.locals = {
        ...res.locals,
        user,
        cartItemsCount: Object.values(user.cart).reduce((a, b) => a + b, 0),
        categories
    };
    next();
}