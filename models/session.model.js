const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
	cart: Object
})

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;