const express = require('express');
const router = express.Router();

const controller = require('../controllers/dashboard.controller');

router.get('/', controller.redirect);

router.get('/table', controller.table);

router.get('/orders', controller.orders);

router.post('/', controller.signin);

router.post('/fbPost', controller.fbPost);

router.get('/signout', controller.signout);

module.exports = router;