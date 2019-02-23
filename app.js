const express = require('express');
const app = require('https-localhost');;
// const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const productRoute = require('./routes/product.route');
const authRoute = require('./routes/auth.route');
const cartRoute = require('./routes/cart.route');
const storeRoute = require('./routes/store.route');
const dashboardRoute = require('./routes/dashboard.route');

const authMiddleware = require('./middleware/auth.middleware');

const Product = require('./models/product.model');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser('jKghReo'));

mongoose.connect('mongodb://localhost/hhshop', { useNewUrlParser: true });

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(authMiddleware);
app.use('/underwear', productRoute);
app.use('/auth', authRoute);
app.use('/cart', cartRoute);
app.use('/store', storeRoute);
app.use('/dashboard', dashboardRoute);

app.get('/', async (req, res) => {
    let products = await Product.find();
    res.render('index', { products: products });
})


app.listen(3000, () => console.log('Listening...'))