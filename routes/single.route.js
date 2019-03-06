const express = require('express');
const router = express.Router();
const path = require('path');

const controller = require('../controllers/single.controller.js');

router.get('/:id', controller.index);

module.exports = router;