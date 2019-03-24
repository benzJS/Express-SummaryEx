const express = require('express');
const router = express.Router();

const controller = require('../controllers/dashboard.controller');

router.get('/', controller.redirect);

router.get('/table', controller.table);

router.get('/orders', controller.orders);

router.get('/users', controller.users);

router.patch('/orders/:id', controller.orderPatch);

router.delete('/orders/:id', controller.orderDelete);

router.post('/', controller.signin);

router.get('/signout', controller.signout);

module.exports = router;