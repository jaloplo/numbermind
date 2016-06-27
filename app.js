var express = require('express');

var port = process.env.PORT || 1337;
var app = new express();

app.listen(port, function(req, res, next) {
   //console.log('Listening on port ' + port + '...');
});

app.use(function(req, res, next) {
    //console.log('Request for ' + req.originalUrl + '...');
    next();
});

app.use(function(req, res, next) {
    res.status(404).send('Page not found');
});

app.get('/', function(req, res, next) {
    res.send('Hello from the root');
});