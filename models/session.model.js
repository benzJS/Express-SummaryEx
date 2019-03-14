const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
	cart: [
    	{
            product: String,
            quantity: Number
    	}
    ],
})

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;