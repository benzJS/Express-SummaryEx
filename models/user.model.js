const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	fbID: String,
    fullname: String,
    email: String,
    password: String,
    cart: [
    	{
            product: String,
            quantity: Number
    	}
    ],
    role: String,
    phone: String,
  	address: String
}, { minimize: false })

const User = mongoose.model('User', userSchema);

module.exports = User;