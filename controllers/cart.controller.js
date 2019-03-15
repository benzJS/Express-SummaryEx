const User = require('../models/user.model');
const Product = require('../models/product.model');
const Option = require('../models/option.model');
const Order = require('../models/order.model');

module.exports.index = async function(req, res, next) {
    const { user } = res.locals;

    // const products = await Promise.all(Object.keys(user.cart).map(async key => {
    //     const productId = key.split('-')[0];
    //     return await Product.findById(productId);
    // }));

    const cart = await Promise.all(user.cart.map(async ({product, quantity}) => {
        const option = await Option.findById(product).populate('product', 'name price image');
        return {...option._doc, quantity: quantity};
    }))

    // const cart = await User.findById(user.id).populate('productOption');
    // const cart = await Option.find().populate('product', 'name price image');
    // const orders = await Order
    //     .find({ state: -1 })
    //     .populate('user');

    res.locals = {...res.locals, cart: cart};
    res.render('cart');
}

module.exports.add = async function(req, res, next) {
    let { user } = res.locals;

    // find option id
    const option = await Option.findOne({
        product: req.body.id,
        size: req.body.size,
        color: req.body.color
    });

    // add to cart
    let cart = [...user.cart];
    const optionIndex = cart.findIndex(({ product }) => product === option._id);
    if(optionIndex === -1) {
        cart = [...cart, { product: option.id, quantity: 1 }];
    } else {
        cart[optionIndex].quantity++;
    }
    // cart = [...cart, option.id];

    //save
    user.cart = [...cart];
    user.save();

    return res.send(true);
}

module.exports.remove = async function(req, res, next) {
    let { user } = res.locals;

    // remove cart item
    const removeIndex = user.cart.findIndex(item => item.product === req.params.id);
    user.cart = [...user.cart.slice(0, removeIndex), ...user.cart.slice(removeIndex + 1)];

    // save
    user.save();


    // total = cart.reduce((a, b) => {
    //     if(typeof a !== 'object') return a + b.price;
    //     return a.price + b.price;
    // }, 0);

    res.send(true);
}

module.exports.update = function(req, res, next) {
    let { user } = res.locals;
    let newCart = [...user.cart];
    // newCart[req.params.id] = parseInt(req.body.quantity);
    productIndex = user.cart.findIndex(({ product }) => product === req.params.id);
    newCart[productIndex].quantity = req.body.quantity;
    user.cart = [...newCart];
    user.save();
    // user.updateOne({ $set: { cart[productIndex].quantity: req.body.quantity } })
    res.json({
        quantity: user.cart[productIndex].quantity,
        cartItemsCount: user.cart.reduce((a, b) => a + b.quantity, 0)
    });
}