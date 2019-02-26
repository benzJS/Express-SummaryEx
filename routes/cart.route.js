const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({dest: '../public/img/uploads'})

const controller = require('../controllers/cart.controller');

router.post('/', upload.any(), controller.add);

router.delete('/', controller.remove);

module.exports = router;