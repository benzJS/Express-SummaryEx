const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
	cart: {
    	type: Object,
    	default: {}
    }
})

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;