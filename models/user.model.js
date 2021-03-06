const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	fbId: String,
  fullname: String,
  email: String,
  password: String,
  cart: {},
  role: String,
  phone: String,
  address: String
}, { minimize: false })

const User = mongoose.model('User', userSchema);

module.exports = User;