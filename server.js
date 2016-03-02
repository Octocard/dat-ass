'use strict';

var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

mongoose.connect('mongodb://localhost/dat-ass');

app.use(bodyParser.json());

app.use(bodyParser.json({ type: 'application/vnd.api+json'}));

app.use(bodyParser.urlencoded({extended: true}));


app.use(methodOverride('X-HTTP-Method-Override'));
var CORS = function(req, res, next) {
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
res.header('Access-Control-Allow-Headers', 'Content-Type');
if ('OPTIONS' === req.method) {
  res.send(200);
}
else {
  next();
}
};
app.use(CORS);

app.get('/', function (req, res) {
    res.send('Check out Dat Ass!!!');
});


app.listen('8081');
exports.module = app;
