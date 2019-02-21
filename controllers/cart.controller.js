const User = require('../models/user.model');
const Product = require('../models/product.model')

module.exports.add = async function(req, res, next) {
    console.log(req.baseUrl);
    let user = await User.findById(req.signedCookies.userId);
    user.cart.push(req.params.id);
    user.save();
    res.redirect('/underwear');
}

module.exports.remove = async function(req, res, next) {
    let user = await User.findById(req.signedCookies.userId);
    user.cart.splice(user.cart.indexOf(req.params.id), 1);
    user.save();
    const products = await Product.find();
    let cart = user.cart.map(id => products.find(product => product.id === id));
    res.send(JSON.stringify(cart));
}