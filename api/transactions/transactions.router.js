const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const transactionsRoute = express.Router();
const crypto = require("crypto");
const randomize = require('randomatic');

transactionsRoute.use(cors());

/////////////////////////////////////Bill Payments/////////////////////////////////////////////////////////
transactionsRoute.post('/transaction', (req, res) => {
    const username = "hofo"; 
    const password = "h@fo!2321";
    const authkey =  "f62376e79e97a37f13645af2b00d2eb441986e2d1ba20c0750581691f67e7544";
    const secretKey = "1e688ec5fda081b0933e3abd2da0a217c26ddd674bc81a0685712af8a4dc61f6";
    var biller_type = req.body.biller_type;
    var customer_name = req.body.customer_name;
    var customer_ref = req.body.customer_ref;
    var msisdn = req.body.msisdn;
    var amount = req.body.amount;
    var transactionId = randomize('0', 15);
    var data = "$" + username + "." + crypto.createHash('sha256').update("$" + password).digest('hex') + "." + "$" + msisdn + "$" + amount + "." + "$" + transactionId;
    var signature = crypto.createHmac('sha256', secretKey).update(data).digest('hex');

    let billData = {
        username: username, password: password,
        biller_type: biller_type,
        customer_name: customer_name, 
        customer_ref: customer_ref,
        optional_field: "",
        amount: amount,
        msisdn: msisdn,
        transactionId: transactionId
      };

    fetch('https://billpay.trueafrican.com/post_transaction', {
        method: 'POST',
        body: JSON.stringify(billData),
        headers: { 
            'Content-Type': 'application/json', 
            'authKey' : authkey, 
            'signature' : signature
        }
    })
    .then(res => res.json())
    .then(response => {
        console.log(response.message);
        res.send(response);
    })
})

///////////////////////////////update from pay-leo/////////////////////////////////////////////////////
transactionsRoute.post('/payment/update', (req, res, body) => {

    // Any request with an XML payload will be parsed
    // and a JavaScript object produced on req.body
    // corresponding to the request payload.
    console.log(req.body);
    var response = req.body.request;

    res.status(200).end(); 
}); 


module.exports = transactionsRoute;
