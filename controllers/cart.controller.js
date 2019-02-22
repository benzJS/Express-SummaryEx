const User = require('../models/user.model');
const Product = require('../models/product.model')

module.exports.add = async function(req, res, next) {
    let { user } = res.locals;
    user.cart = [...user.cart, req.params.id];
    user.save();
    res.redirect('/underwear');
}

module.exports.remove = async function(req, res, next) {
    let { user, priceAnal } = res.locals;
    user.cart.splice(user.cart.indexOf(req.params.id), 1);
    user.save();
    const products = await Product.find();
    let cart = user.cart.map(id => products.find(product => product.id === id));
    total = cart.reduce((a, b) => {
        if(typeof a !== 'object') return a + b.price;
        return a.price + b.price;
    }, 0)
    res.send(JSON.stringify({ cart: cart, total: priceAnal(total)}));
}