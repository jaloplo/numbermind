var express = require('express');
var nunjucks = require('nunjucks');

var port = process.env.PORT || 1337;
var app = new express();


var engine = nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
});

app.set('views', './views');

app.use(function(req, res, next) {
    console.log('[' + req.method + ']::' + req.originalUrl);
    next();
});


app.listen(port, function(req, res, next) {
   console.log('Listening on port ' + port + '...');
});

app.get('/', function(req, res, next) {
    res.render('numbermind.html');
});

app.use(function(req, res, next) {
    res.status(404).send('Page not found from express and source folder');
});