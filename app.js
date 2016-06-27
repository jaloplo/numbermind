var express = require('express');

var port = process.env.PORT || 1337;
var app = new express();

app.get('/', function(req, res, next) {
    res.send('Hello from the root');
});

app.listen(port, function(req, res, next) {
    console.log('Server listening on port ' + port);
    console.log('Running...');
    next();
});

/*
var http = require('http')
var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);
*/