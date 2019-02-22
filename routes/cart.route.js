const express = require('express');
const router = express.Router();

const controller = require('../controllers/cart.controller');

router.get('/add/:id', controller.add);

router.delete('/remove/:id', controller.remove);

module.exports = router;