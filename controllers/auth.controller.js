const md5 = require('md5');
const moment = require('moment');

const User = require('../models/user.model');
const Session = require('../models/session.model');

module.exports.signin = async function(req, res, next) {
    let user = await User.findOne({email: req.body.email});
    if(user && user.password === md5(req.body.password)) {
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

module.exports.fbPost = async function(req, res, next) {
    let user = await User.findOne({fbId: req.body.id});
    const sessionUser = await Session.findById(req.signedCookies.sessionId);
	if(!user) {
		user = await User.create({
            fbId: req.body.id,
            fullname: req.body.name,
            role: 'mem',
            date: moment().format()
        })
    }
    user.cart = {...sessionUser.cart};
    await user.save();
    res.clearCookie('sessionId');
	res.cookie('userId', user._id, { signed: true });
	res.send(true);
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
    req.body.password = md5(req.body.password);
    user = await User.create({
        ...req.body,
        cart: sessionUser.cart,
        role: 'mem',
        date: moment().format()
    });
    await Session.deleteOne({_id: req.signedCookies.sessionId});
    res.clearCookie('sessionId');
    res.cookie('userId', user.id, {signed: true});
    res.send(true);
}

module.exports.recover = async function(req, res, next) {
    // find user
    let user = await User.findById(req.params.id);

    if(req.body.oldPassword && md5(req.body.oldPassword) !== user.password) {
        return res.sendStatus(403);
    }
    
    // remove oldPassword field
    delete req.body.oldPassword;

    // if client wants to recover password
    if(req.body.password) req.body.password = md5(req.body.password);

    // update & save
    await User.updateOne({_id: user._id}, req.body);
    if(req.cookies.addressRequired) {
        res.clearCookie('addressRequired');
        return res.sendStatus(202);
    }
    return res.sendStatus(200);
}