const User = require('../models/user.model')

module.exports.signin = async function(req, res, next) {
    let user = await User.findOne({email: req.body.email});
    if(user) {
        res.cookie('userId', user.id, { signed: true });
        return res.redirect('/underwear');
    }
    res.send('Invalid info');
}

module.exports.signout = function(req, res, next) {
    res.clearCookie('userId', { signed: true });
    res.redirect('/underwear');
}

module.exports.signup = async function(req, res, next) {
    let user = await User.findOne({email: req.body.email});
    if(user) {
    	debugger;
    	res.send(JSON.stringify('Email already exist'));
    	return;
    }
    user = await User.create(req.body);
    res.send(JSON.stringify('Successful'));
}