const express = require('express');
const router = express();

const controller = require('../controllers/auth.controller')

router.post('/signin', controller.signin);

router.post('/signup', controller.signup);

router.get('/signout', controller.signout);

module.exports = router;