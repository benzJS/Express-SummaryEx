const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
	cart: Array
})

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;