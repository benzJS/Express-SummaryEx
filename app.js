require('dotenv').config();

const express = require('express');
// const app = require('https-localhost');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const nanoid = require('nanoid');
const request = require('request');

// Router
const productRoute = require('./routes/product.route');
const authRoute = require('./routes/auth.route');
const cartRoute = require('./routes/cart.route');
const storeRoute = require('./routes/store.route');
const dashboardRoute = require('./routes/dashboard.route');
const singleRoute = require('./routes/single.route');
const checkoutRoute = require('./routes/checkout.route');
const webhookRoute = require('./routes/webhook.route.js');
const userRouter = require('./routes/user.route.js');

// Middleware
const authMiddleware = require('./middleware/auth.middleware');

//Models
const Product = require('./models/product.model');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser('jKghReo'));

mongoose.connect('mongodb://localhost/hhshop', { useNewUrlParser: true });

app.use(express.static('public'));
app.use(authMiddleware);
app.use('/single', singleRoute);
app.use('/products', productRoute);
app.use('/auth', authRoute);
app.use('/cart', cartRoute);
app.use('/store', storeRoute);
app.use('/dashboard', dashboardRoute);
app.use('/checkout', checkoutRoute);
app.use('/webhook', webhookRoute);
app.use('/user', userRouter);

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    let products = await Product.find();
    res.render('index', { products: products });
})

app.get('/search', async (req, res) => {
	let products = await Product.find({ name: new RegExp(req.query.name, "i") });
	res.json(products);
})

app.listen(process.env.PORT || 3000, () => console.log('Listening...'))