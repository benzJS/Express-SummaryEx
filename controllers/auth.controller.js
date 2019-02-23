const User = require('../models/user.model')

module.exports.signin = async function(req, res, next) {
    let user = await User.findOne({email: req.body.email});
    if(user) {
        user.cart = [...user.cart, ...res.locals.session.cart];
        user.save();
        res.clearCookie('sessionId');
        res.cookie('userId', user.id, { signed: true });
        res.send(true);
        return;
    }
    res.send(false);
}

module.exports.signout = function(req, res, next) {
    res.clearCookie('userId', { signed: true });
    res.redirect('/underwear');
}

module.exports.signup = async function(req, res, next) {
    let user = await User.findOne({email: req.body.email});
    if(user) {
    	res.send(false);
    	return;
    }
    user = await User.create(req.body);
    res.cookie('userId', user.id, {signed: true});
    res.send(true);
}