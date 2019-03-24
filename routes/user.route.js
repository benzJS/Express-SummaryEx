const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.controller');

router.use(function(req, res, next) {
	const { user } = res.locals;
	if(!user.fullname) return res.redirect('/');
	return next();
})

router.get('/', controller.redirect);

router.get('/info', controller.info);

router.get('/orders', controller.orders);

router.get('/address', controller.address);

module.exports = router;