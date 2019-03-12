const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
	cart: {
    	type: Object
    }
})

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;