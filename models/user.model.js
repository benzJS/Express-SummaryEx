const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	fbID: String,
    fullname: String,
    email: String,
    password: String,
    cart: {
    	type: Object
    },
    role: String
})

const User = mongoose.model('User', userSchema);

module.exports = User;