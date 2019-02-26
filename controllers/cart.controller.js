const User = require('../models/user.model');
const Product = require('../models/product.model');

module.exports.add = async function(req, res, next) {
    // res.send(req.body);
    if(res.locals.session) {
        let { session } = res.locals;
        session.cart = [...session.cart, req.body];
        session.save();
        // res.redirect('/underwear');
        return res.send(true);
    }
    let { user } = res.locals;
    user.cart = [...user.cart, req.body];
    user.save();
    return res.send(true);
}

module.exports.remove = async function(req, res, next) {
    console.log(req.body);
    const { priceAnal } = res.locals;
    const products = await Product.find();
    let cart;
    if(res.locals.session) {
        let { session } = res.locals;
        removeIndex = session.cart.findIndex(({size, color, id}) => {
            return req.body.size === size 
            && req.body.color === color
            && req.body._id === id
        }); 
        debugger;
        session.cart = [...session.cart.slice(0, removeIndex), ...session.cart.slice(removeIndex + 1)];
        // session.cart.splice(0, 1);
        session.save();
        cart = session.cart.map(cartItem => Object.assign({}, {...products.find(product => product.id === cartItem.id)._doc,
            size: cartItem.size,
            color: cartItem.color
        }));
    } else {
        let { user } = res.locals;
        removeIndex = user.cart.findIndex(({size, color, id}) => {
            return req.body.size === size 
            && req.body.color === color
            && req.body._id === id
        }); 
        debugger;
        user.cart = [...user.cart.slice(0, removeIndex), ...user.cart.slice(removeIndex + 1)];
        // user.cart.splice(0, 1);
        user.save();
        cart = user.cart.map(cartItem => Object.assign({}, {...products.find(product => product.id === cartItem.id)._doc,
            size: cartItem.size,
            color: cartItem.color
        }));
    }
    total = cart.reduce((a, b) => {
        if(typeof a !== 'object') return a + b.price;
        return a.price + b.price;
    }, 0)
    res.send(JSON.stringify({ cart: cart, total: priceAnal(total)}));
}