var _ = require('underscore');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('./logger');

module.exports = startBaseServer;

function startBaseServer(options) {

	var app = express();

	//*
	app.use(bodyParser.urlencoded({
		extended: true
	})); // for parsing application/x-www-form-urlencoded
	//*/
	/*
	app.use(bodyParser.raw({
		type: ['*', '*'].join('/')
	})); // sets req.body to a Buffer
	//*/

	app.use(logger());

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

	app.get('/registration', function(req, res) {
		res.sendFile(options.baseDir + '/pub/registration.html');
	});

	app.post('/confirmation', function(req, res) {
		res.sendFile(options.baseDir + '/pub/confirmation.html');
	});

	app.listen(options.port, function() {
		console.log('base server listening on port ' + options.port);
	});

}