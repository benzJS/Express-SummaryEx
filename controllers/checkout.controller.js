const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Option = require('../models/option.model');

const moment = require('moment');
const request = require('request');

module.exports.auth = async function(req, res, next) {
    const user = await User.findById(req.signedCookies.userId);
    if(!user.phone || !user.address) {
        res.cookie('addressRequired', 'true');
        return res.redirect('/user/address');
    }
    const cart = await Object.keys(user.cart).reduce(async (accP, key) => {
        const option = await Option.findById(key).populate('product', 'name price image');
        const acc = await accP;
        acc[key] = {
            ...option._doc,
            quantity: user.cart[key]
        }
        return acc;
    }, {});

	res.locals = {...res.locals, cart, user};
	return res.render('checkout-info');
}

module.exports.submit = async function(req, res, next) {
    let user = await User.findById(req.signedCookies.userId);


    if(Object.keys(user.cart).length > 0) {
        var order = await Order.create({
            user: user.id,
            summary: {...user.cart},
            state: -1,
            date: moment().format()
        });
        var elements = await Promise.all(Object.keys(user.cart).map(async key => {
            const option = await Option.findById(key).populate('product', 'name image');
            return {
                "title": `${option.product.name} (Size: ${option.size}, Color: ${option.color})`,
                "subtitle": `Số lượng: ${user.cart[key]}`,
                "image_url": `https://hhshop.serveo.net/${option.product.image[0]}`
            }
        }));
        user.cart = {};
        user.save();
    }

    // Construct the message body
    let request_body = {
        "recipient": {
            "id": '2440115656045904'
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "top_element_style": "compact",
                    "elements": elements,
                    "buttons": [
                      {
                        "title": "Accepts",
                        "type": "postback",
                        "payload": order.id
                      }
                    ]
                }
            }
        }
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": 'EAAEoaPtPvZA0BAHEUcenhmTBMJofrtOlv7H3uqZCgBRjo4KpJ6JneZAEWEwfoffcjN58UPG4EQap3EFKZBYH7Aas8Pg4ZBwsug8WzoEhUXnNr7Po2vky47NYepz5ZCJpkfQE9Fz2HB4LVVrZAMIzvvdbmZBASIHlqPDorvHB1rbsNg0iL4Hob2cw' },
        "method": "POST",
        "json": request_body
    }, (err, resp, body) => {
        if (!err) {
          console.log('message sent!')
        } else {
          console.error("Unable to send message:" + err);
        }
        res.render('checkout-success');
    });
}