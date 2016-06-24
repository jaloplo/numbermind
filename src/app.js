var express = require('express');

var app = new express();
app.listen(8080, function(req, res, next) {
    console.log('Listening on port ' + 8080 + '...');
});

app.use(function(req, res, next) {
    console.log('Request for ' + req.originalUrl + '...');
    next();
});

app.use(function(req, res, next) {
    res.status(404).send('Page not found');
});