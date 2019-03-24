const User = require('../models/user.model');
const Product = require('../models/product.model');
const Option = require('../models/option.model');
const Order = require('../models/order.model');

module.exports.index = async function(req, res, next) {
    const { user } = res.locals;

    const cart = await Object.keys(user.cart).reduce(async (accP, key) => {
        const option = await Option.findById(key).populate('product', 'name price image');
        const acc = await accP;
        acc[key] = {
            ...option._doc,
            quantity: user.cart[key]
        }
        return acc;
    }, {});

    res.locals = {...res.locals, cart};
    res.render('cart');
}

module.exports.add = async function(req, res, next) {
    let { user } = res.locals;
    let cart = {...user.cart};

    // find option id
    const option = await Option.findOne({
        product: req.body.id,
        size: req.body.size,
        color: req.body.color
    });

    // add to cart
    cart[option.id] = cart[option.id] ? cart[option.id] + 1 : 1;

    //save
    user.cart = {...cart};
    user.save();

    return res.send(true);
}

module.exports.remove = async function(req, res, next) {
    let { user } = res.locals;
    let cart = {...user.cart};

    delete cart[req.params.id];

    // save
    user.cart = {...cart};
    user.save();


    // total = cart.reduce((a, b) => {
    //     if(typeof a !== 'object') return a + b.price;
    //     return a.price + b.price;
    // }, 0);

    res.send(true);
}

module.exports.update = function(req, res, next) {
    let { user } = res.locals;
    let cart = {...user.cart};

    cart[req.params.id] = parseInt(req.body.quantity);

    user.cart = {...cart};
    user.save();
    res.json({
        quantity: user.cart[req.params.id],
        cartItemsCount: Object.values(user.cart).reduce((a, b) => a + b, 0)
    });
}