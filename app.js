var express = require('express');

var port = process.env.PORT || 8080;


var app = new express();
app.listen(port, function(req, res, next) {
    console.log('Listening on port ' + port + '...');
});

app.use(function(req, res, next) {
    console.log('Request for ' + req.originalUrl + '...');
    next();
});

app.get('/', function(req, res, next) {
    return 'Page from node.js app in azure.';
});

app.get('/hello', function(req, res, next) {
    return 'BIG HELLO from node.js app in azure.';
});

app.use(function(req, res, next) {
    res.status(404).send('Page not found');
});