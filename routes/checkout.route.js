const express = require('express');
const router = express.Router();

const User = require('../models/user.model');

const controller = require('../controllers/checkout.controller');

router.use(async (req, res, next) => {
	if(!req.signedCookies.userId) {
		return res.render('checkout-auth');
	}
	const user = await User.findById(req.signedCookies.userId);
	if(Object.keys(user.cart).length < 1) return res.redirect('/cart');
	next();
})

router.get('/', controller.auth);

router.get('/submit', controller.submit)

module.exports = router;