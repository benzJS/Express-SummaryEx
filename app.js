const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const productRoute = require('./routes/product.route');
const authRoute = require('./routes/auth.route');

const Product = require('./models/product.model');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser('jKghReo'));

mongoose.connect('mongodb://localhost/hhshop', { useNewUrlParser: true });

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use('/underwear', productRoute);
app.use('/auth', authRoute);

app.get('/', async (req, res) => {
    let products = await Product.find();
    res.render('index', { products: products });
})

app.listen(3000, () => console.log('Listening...'))