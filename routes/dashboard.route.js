const express = require('express');
const router = express.Router();

const controller = require('../controllers/dashboard.controller');

router.get('/', controller.index);

router.post('/', controller.postIndex);

module.exports = router;