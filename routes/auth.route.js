const express = require('express');
const router = express();

const controller = require('../controllers/auth.controller')

router.get('/signin', controller.index);