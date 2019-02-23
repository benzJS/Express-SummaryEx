const User = require('../models/user.model');
const Product = require('../models/product.model')

module.exports.add = async function(req, res, next) {
    if(res.locals.session) {
        let { session } = res.locals;
        session.cart = [...session.cart, req.params.id];
        session.save();
        res.redirect('/underwear');
        return;
    }
    let { user } = res.locals;
    user.cart = [...user.cart, req.params.id];
    user.save();
    res.redirect('/underwear');
}

module.exports.remove = async function(req, res, next) {
    const { priceAnal } = res.locals;
    const products = await Product.find();
    let cart;
    if(res.locals.session) {
        let { session } = res.locals;
        // session.cart.splice(session.cart.indexOf(req.params.id), 1);
        removeIndex = session.cart.indexOf(req.params.id); 
        session.cart = [...session.cart.slice(0, removeIndex), ...session.cart.slice(removeIndex + 1)];
        session.save();
        cart = session.cart.map(id => products.find(product => product.id === id));
    } else {
        let { user } = res.locals;
        user.cart.splice(user.cart.indexOf(req.params.id), 1);
        user.save();
        cart = user.cart.map(id => products.find(product => product.id === id));
    }
    total = cart.reduce((a, b) => {
        if(typeof a !== 'object') return a + b.price;
        return a.price + b.price;
    }, 0)
    res.send(JSON.stringify({ cart: cart, total: priceAnal(total)}));
}