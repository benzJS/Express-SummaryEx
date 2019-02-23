const express = require('express');
const router = express.Router();

const controller = require('../controllers/dashboard.controller');

router.get('/', controller.index);

router.post('/', controller.postIndex);

router.post('/fbPost', controller.fbPost);

router.get('/signout', controller.signout);

module.exports = router;