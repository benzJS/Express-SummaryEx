const User = require('../models/user.model');
const Product = require('../models/product.model')

module.exports.add = async function(req, res, next) {
    console.log(req.baseUrl);
    let user = await User.findById(req.signedCookies.userId);
    // console.log(user);
    user.cart.push(req.params.id);
    user.save();
    res.redirect('/underwear');
}

module.exports.remove = async function(req, res, next) {
    let user = await User.findById(req.signedCookies.userId);
    user.cart.splice(user.cart.indexOf(req.params.id), 1);
    user.save();
    let cart = (await Product.find()).filter(product => user.cart.indexOf(product._id) !== -1);
    res.send(JSON.stringify(cart));
}