const express = require('express');
const router = express.Router();
const path = require('path');

const controller = require('../controllers/product.controller.js');
console.log(__dirname)

router.use('/:category', express.static(path.join(__dirname, '../public')), controller.index);

module.exports = router;