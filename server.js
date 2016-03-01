'use strict';

var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    db = mongoose.connect('mongodb://localhost/dat-ass');

app.get('/', function (req, res) {
    res.send('Check out Dat Ass!!!')
});


app.listen('8081');
exports.module = app;
