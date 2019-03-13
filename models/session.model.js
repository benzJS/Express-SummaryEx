const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
	cart: {
		type: {
			foo: Number
		}
	}
}, { minimize: false })

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;