const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
	cart: {}
}, { minimize: false })

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;