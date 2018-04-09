const functions = require('firebase-functions');
var cors = require('cors')

const express = require('express');
const routes = require('./routes/api');
const bodyParser = require('body-parser');
var https = require('https');
var http = require('http');

var api_key = 'key-2255aca5d0b5c2bbabf78d86621037a9';
var DOMAIN1 = 'mail.hopscotch.co';
var DOMAIN2 = 'sandboxc63d61a94a1c41febb072370e56d74f3.mailgun.org'
var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN1});

// set up express app
const app = express();

app.use(bodyParser.json());
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});
app.use('/api', routes);

//listen for requests
// app.listen(process.env.port || 4000, function(){
//   console.log('Now listening for requests');
// });
http.createServer(app).listen(80);
https.createServer(app).listen(443);
exports.cloudConvertApi = functions.https.onRequest(app);


// Mail Gun Send Email Function
var sendEmail = function sendEmail(req, res) {    
    console.log(req.body)
    if(req.body.to && req.body.content) {
        var data = {
            from: 'no-reply@hopstoch.co',
            subject: 'A Hopscotch user shared their project with you!',
            html: req.body.content,           
            to: req.body.to
        };
        console.log('+++++')
        mailgun.messages().send(data, function (error, body) {
            console.log(error)
            console.log('---------')
            res.status(200).send('Email has been sent successfully!');
        });
    } else {
        res.status(500).send('Required field(s) do not exist');
    }
};


exports.mailGunFunction = functions.https.onRequest((req, res) => {
    var corsFn = cors();
    corsFn(req, res, function() {
        sendEmail(req, res);
    });
});