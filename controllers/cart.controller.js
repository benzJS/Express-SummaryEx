const User = require('../models/user.model');
const Product = require('../models/product.model');

module.exports.index = async function(req, res, next) {
    const { user } = res.locals;
    const products = await Product.find();
    debugger;
    const cart = Object.keys(user.cart).reduce((accumulator, key) => {
        const productId = key.split('-')[0];
        const optionId = key.split('-')[1];
        const product = products.find(({id}) => id === productId);
        accumulator[key] = {
            ...product._doc,
            size: product.option.find(({id}) => id === optionId).size,
            color: product.option.find(({id}) => id === optionId).color,
            quantity: user.cart[key]
        }
        return accumulator;
    }, {});
    res.locals = {...res.locals, cart: cart};
    res.render('cart');
}

module.exports.add = async function(req, res, next) {
    let { user } = res.locals;

    // generate product id
    const optionId = (await Product.findById(req.body.id)).option.find(({ size, color }) => {
        return size === req.body.size && color === req.body.color;
    }).id;
    const productId = req.body.id.concat('-', optionId);

    // add to cart
    let cart = {...user.cart};
    cart[productId] = cart[productId] ? cart[productId] + 1 : 1;

    //save
    user.cart = {...cart};
    user.save();

    return res.send(true);
}

module.exports.remove = async function(req, res, next) {
    const { priceAnal } = res.locals;
    let { user } = res.locals;
    let newCart = {...user.cart};

    // remove cart item
    delete newCart[req.params.id];

    // save
    user.cart = {...newCart};
    user.save();


    // total = cart.reduce((a, b) => {
    //     if(typeof a !== 'object') return a + b.price;
    //     return a.price + b.price;
    // }, 0);

    res.send(true);
}

module.exports.update = function(req, res, next) {
    let { user } = res.locals;
    let newCart = {...user.cart};
    newCart[req.params.id] = req.body.quantity;
    user.cart = {...newCart};
    user.save();
    res.json({quantity: user.cart[req.params.id]});
}