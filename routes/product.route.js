const express = require('express');
const router = express.Router();

const controller = require('../controllers/product.controller.js');

router.get('/', controller.index);

router.get('/:id', controller.single);

module.exports = router;