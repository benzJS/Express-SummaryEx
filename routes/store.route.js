const express = require('express');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
  	cb(null, './public/img/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const router = express.Router();
const upload = multer({ storage: storage });

const controller = require('../controllers/store.controller');

router.post('/product', upload.any(), controller.postCreate);

router.delete('/product/:id', controller.deleteProduct);

router.patch('/product/:id', upload.any(), controller.editProduct);

module.exports = router;