const express = require('express');
const router = express.Router();

const controller = require('../controllers/checkout.controller.js');

router.get('/', controller.auth);

module.exports = router;