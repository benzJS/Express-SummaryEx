const User = require('../models/user.model')

module.exports.signin = async function(req, res, next) {
    let user = await User.findOne({email: req.body.email});
    if(user) {
        res.cookie('userId', user.id, { signed: true });
        res.send(true);
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
    	debugger;
    	res.send(false);
    	return;
    }
    user = await User.create(req.body);
    res.cookie('userId', user.id, {signed: true});
    res.send(true);
}