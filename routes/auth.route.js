const express = require('express');
const router = express();

const controller = require('../controllers/auth.controller')

router.patch('/:id', controller.recover);

router.post('/signin', controller.signin);

router.post('/signup', controller.signup);

router.get('/signout', controller.signout);

router.post('/fbPost', controller.fbPost);

module.exports = router;