const User = require('../models/user.model');
const Product = require('../models/product.model');

module.exports.add = async function(req, res, next) {
    if(res.locals.session) {
        let { session } = res.locals;
        session.cart = [...session.cart, req.body];
        session.save();
        return res.send(true);
    }
    let { user } = res.locals;
    user.cart = [...user.cart, req.body];
    user.save();
    return res.send(true);
}

module.exports.remove = async function(req, res, next) {
    const { priceAnal } = res.locals;
    const products = await Product.find();
    let cart = [];
    if(res.locals.session) {
        let { session } = res.locals;
        removeIndex = session.cart.length < 2 ? 0 : session.cart.findIndex(({size, color, id}) => {
            return req.body.size === size 
            && req.body.color === color
            && req.body._id === id
        });
        session.cart = [...session.cart.slice(0, removeIndex), ...session.cart.slice(removeIndex + 1)];
        debugger;
        session.save();
        if(session.cart.length > 0) {
            cart = session.cart.map(cartItem => {
                const product = products.find(item => item.id === cartItem.id);
                return Object.assign({}, {...product._doc,
                    size: cartItem.size,
                    color: cartItem.color
                })
            });
        }
        debugger;
    } else {
        let { user } = res.locals;
        removeIndex = user.cart.findIndex(({size, color, id}) => {
            return req.body.size === size 
            && req.body.color === color
            && req.body._id === id
        });
        user.cart = [...user.cart.slice(0, removeIndex), ...user.cart.slice(removeIndex + 1)];
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
    debugger;
    res.send(JSON.stringify({ cart: cart, total: priceAnal(total)}));
}