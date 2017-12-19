var express = require('express');
var Payeer = require('./lib/merchant');
var app = express();

// Success URL:
// Fail URL: redirect client to url
// Status URL:

const payeer = new Payeer(447357451, 'secret', {debug: false});
payeer.getOrderId({
    m_amount: 10.121,
    m_curr: 'usd',
    m_desc: 'Hello World'
})
    .then(res => {
        return payeer.formaterData(res);
    })
    .then(res => {
        return payeer.createPaymet(res)
    })
    .then(console.log)
    .catch((error) => {
        console.error('Create Error,', error);
    });

