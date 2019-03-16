const User = require('../models/user.model');
const Session = require('../models/session.model');

module.exports.signin = async function(req, res, next) {
    let user = await User.findOne({email: req.body.email});
    if(user) {
        const sessionUser = await Session.findById(req.signedCookies.sessionId);
        user.cart = {...user.cart, ...sessionUser.cart};
        user.save();
        await Session.deleteOne({_id: req.signedCookies.sessionId});
        res.clearCookie('sessionId');
        res.cookie('userId', user.id, { signed: true });
        return res.send(true);
    }
    res.send(false);
}

module.exports.signout = function(req, res, next) {
    res.clearCookie('userId', { signed: true });
    res.send(true);
}

module.exports.signup = async function(req, res, next) {
    let user = await User.findOne({email: req.body.email});
    if(user) {
    	return res.send(false);
    }
    const sessionUser = await Session.findById(req.signedCookies.sessionId);
    user = await User.create({...req.body, cart: sessionUser.cart});
    await Session.deleteOne({_id: req.signedCookies.sessionId});
    res.clearCookie('sessionId');
    res.cookie('userId', user.id, {signed: true});
    res.send(true);
}