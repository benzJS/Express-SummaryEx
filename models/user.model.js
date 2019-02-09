const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: Array
})

const User = mongoose.model('User', productSchema);

module.exports = User;