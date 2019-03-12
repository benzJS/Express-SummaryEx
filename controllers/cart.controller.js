const User = require('../models/user.model');
const Product = require('../models/product.model');

module.exports.index = async function(req, res, next) {
    const { user } = res.locals;
    const products = await Product.find();
    const cart = Object.keys(user.cart).reduce((accumulator, key) => {
        const productId = key.split('-')[0];
        const optionId = key.split('-')[1];
        const product = products.find(({id}) => id === productId);
        accumulator[key] = {
            ...product._doc,
            size: product.option.find(({id}) => id === optionId).size,
            color: product.option.find(({id}) => id === optionId).color,
            amount: user.cart[key]
        }
        return accumulator;
    }, {});
    debugger;
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
    const products = await Product.find();
    let { user } = res.locals;
    let newCart = {...user.cart};

    // remove cart item
    delete newCart[productId];

    // save
    user.cart = {...newCart};
    user.save();


    total = cart.reduce((a, b) => {
        if(typeof a !== 'object') return a + b.price;
        return a.price + b.price;
    }, 0);

    res.json({ cart: cart, total: priceAnal(total)});
}

module.exports.update = function(req, res, next) {

}