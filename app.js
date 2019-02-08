const express = require('express');
const app = express();
const mongoose = require('mongoose');

const productRoute = require('./routes/product.route');

const Product = require('./models/product.model');

mongoose.connect('mongodb://localhost/hhshop');

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use('/underwear', productRoute);

app.get('/', async (req, res) => {
    let products = await Product.find();
    res.render('index', { products: products });
})

app.listen(3000, () => console.log('Listening...'))