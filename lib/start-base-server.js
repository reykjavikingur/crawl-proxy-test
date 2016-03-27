var _ = require('underscore');
var express = require('express');

module.exports = startBaseServer;

function startBaseServer(options) {
	options = _.defaults(options || {}, {
		port: 3600
	});

	var app = express();

	app.all('*', function(req, res, next) {
		logRequest(req);
		next();
	});

	app.get('/', function(req, res) {
		res.set('x-fake-test', 1234)
		res.status(200).send('Hello, world.');
	});

	app.get('/example', function(req, res) {
		res.sendFile(options.baseDir + '/pub/example.html');
	});

	app.get('/alternate', function(req, res) {
		res.sendFile(options.baseDir + '/pub/alternate.html');
	});

	app.get('/forbidden', function(req, res) {
		res.status(403).send('Sorry, no way.');
	});

	app.get('/old-path', function(req, res) {
		res.redirect(301, '/new-path');
	});

	app.get('/new-path', function(req, res) {
		res.send('This is the new stuff.');
	});

	app.listen(options.port, function() {
		console.log('base server listening on port ' + options.port);
	});

	function logRequest(req) {
		console.log(req.method + ' ' + req.url, req.headers, req.query);
	}
}