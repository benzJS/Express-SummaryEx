const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({dest: '../public/img/uploads'})

const controller = require('../controllers/cart.controller');

router.get('/', controller.index);

router.post('/', upload.any(), controller.add);

router.patch('/:id', controller.update);

router.delete('/:id', controller.remove);

module.exports = router;